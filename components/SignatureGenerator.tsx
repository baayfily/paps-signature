"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import SignatureForm from "./SignatureForm";
import SignaturePreview from "./SignaturePreview";
import GmailInstructions from "./GmailInstructions";
import { generateSignatureHtml, type SignatureData } from "@/lib/generateHtml";
import { TRANSLATIONS, type Language } from "@/lib/translations";
import { DEFAULT_COUNTRIES, type CountryConfig } from "@/lib/defaultCountries";
import confetti from "canvas-confetti";

const DEFAULT_DATA: SignatureData = {
  intro: "Your friend,",
  fullName: "",
  title: "",
  phone: "",
  email: "",
  linkLabel: "",
  linkUrl: "",
};

const ALL_SOCIALS = ["LinkedIn", "X", "Facebook", "Instagram", "TikTok", "YouTube"];

// Client-side parser for the CSV configuration file
function parseCSV(text: string): CountryConfig[] {
  const lines = text.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const list: CountryConfig[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split on commas but respect double quotes
    const values: string[] = [];
    let currentVal = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());
    
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      let val = values[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      row[h] = val;
    });
    
    const activeSocials = row['activeSocials']
      ? row['activeSocials'].split(';').map((s: string) => s.trim()).filter(Boolean)
      : [];
      
    list.push({
      id: row['id'] || ('country-' + i),
      name: row['name'] || 'Inconnu',
      language: (row['language'] || 'fr') as Language,
      websiteUrl: row['websiteUrl'] || 'https://papslogistics.com',
      utmSource: row['utmSource'] || '',
      utmMedium: row['utmMedium'] || '',
      utmCampaign: row['utmCampaign'] || '',
      activeSocials,
      linkedinUrl: row['linkedinUrl'] || '',
      xUrl: row['xUrl'] || '',
      facebookUrl: row['facebookUrl'] || '',
      instagramUrl: row['instagramUrl'] || '',
      tiktokUrl: row['tiktokUrl'] || '',
      youtubeUrl: row['youtubeUrl'] || '',
      bannerUrl: row['bannerUrl'] || '',
      bannerLink: row['bannerLink'] || '',
      phonePrefix: row['phonePrefix'] || ''
    });
  }
  return list;
}

// Client-side CSV generator for exporting
function exportToCSV(countriesList: CountryConfig[]): string {
  const headers = [
    'id', 'name', 'language', 'websiteUrl', 'utmSource', 'utmMedium', 'utmCampaign',
    'activeSocials', 'linkedinUrl', 'xUrl', 'facebookUrl', 'instagramUrl', 'tiktokUrl', 'youtubeUrl',
    'bannerUrl', 'bannerLink', 'phonePrefix'
  ];
  
  const csvRows = [headers.join(',')];
  
  countriesList.forEach(c => {
    const values = [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.language,
      c.websiteUrl,
      c.utmSource,
      c.utmMedium,
      c.utmCampaign,
      `"${c.activeSocials.join(';')}"`,
      c.linkedinUrl || '',
      c.xUrl || '',
      c.facebookUrl || '',
      c.instagramUrl || '',
      c.tiktokUrl || '',
      c.youtubeUrl || '',
      c.bannerUrl || '',
      c.bannerLink || '',
      c.phonePrefix || ''
    ];
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

export default function SignatureGenerator() {
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);
  const [origin, setOrigin] = useState<string>("");
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [draftCountries, setDraftCountries] = useState<CountryConfig[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("sn");
  const [activeTab, setActiveTab] = useState<"generator" | "admin">("generator");
  const [editingCountryId, setEditingCountryId] = useState<string | null>("sn");
  
  // UI and password states
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Form validation visibility states
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Reset validation feedback on country change
  useEffect(() => {
    setTouchedFields({});
    setSubmitAttempted(false);
  }, [selectedCountryId]);

  const syncCountries = (newList: CountryConfig[]) => {
    setCountries(newList);
    setDraftCountries(JSON.parse(JSON.stringify(newList))); // Deep clone for draft
  };

  const loadFromCSV = async () => {
    try {
      const response = await fetch("/countries.csv");
      const text = await response.text();
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        syncCountries(parsed);
        localStorage.setItem("paps_signature_countries", JSON.stringify(parsed));
        setSelectedCountryId(parsed[0].id);
        setEditingCountryId(parsed[0].id);
      }
    } catch (err) {
      console.error("Failed to load CSV, using defaults:", err);
      syncCountries(DEFAULT_COUNTRIES);
      localStorage.setItem("paps_signature_countries", JSON.stringify(DEFAULT_COUNTRIES));
      setSelectedCountryId(DEFAULT_COUNTRIES[0].id);
      setEditingCountryId(DEFAULT_COUNTRIES[0].id);
    }
  };

  // Load origin, countries and check admin auth session
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      
      const auth = sessionStorage.getItem("paps_admin_auth");
      if (auth === "true") {
        setIsAdminAuthenticated(true);
      }

      const stored = localStorage.getItem("paps_signature_countries");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          syncCountries(parsed);
          if (parsed.length > 0) {
            setSelectedCountryId(parsed[0].id);
            setEditingCountryId(parsed[0].id);
          }
        } catch {
          loadFromCSV();
        }
      } else {
        loadFromCSV();
      }
    }
  }, []);

  const activeCountry = countries.find((c) => c.id === selectedCountryId) || DEFAULT_COUNTRIES[0];
  const activeLanguage = activeCountry?.language || "fr";
  const t = TRANSLATIONS[activeLanguage] || TRANSLATIONS["fr"];

  // Derived validations (Name, Title, Email and Phone are required)
  const nameVal = data.fullName || "";
  const nameError = nameVal.trim() === "" ? "Le nom complet est obligatoire." : null;

  const titleVal = data.title || "";
  const titleError = titleVal.trim() === "" ? "Le poste est obligatoire." : null;

  const emailVal = data.email || "";
  let emailError: string | null = null;
  if (emailVal.trim() === "") {
    emailError = "L'adresse email est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    emailError = "Veuillez entrer une adresse email valide.";
  }

  const phoneVal = data.phone || "";
  const digitsOnly = phoneVal.replace(/\D/g, "");

  let phoneError: string | null = null;
  if (phoneVal.trim() === "") {
    phoneError = "Le numéro de téléphone est obligatoire.";
  } else {
    if (activeCountry.id === "sn" && digitsOnly.length !== 9) {
      phoneError = `Le numéro doit comporter exactement 9 chiffres (ex: 77 123 45 67).`;
    } else if (activeCountry.id === "ci" && digitsOnly.length !== 10) {
      phoneError = `Le numéro doit comporter exactement 10 chiffres (ex: 07 12 34 56 78).`;
    } else if (activeCountry.id === "cv" && digitsOnly.length !== 7) {
      phoneError = `Le numéro doit comporter exactement 7 chiffres (ex: 991 23 45).`;
    } else if (digitsOnly.length < 5 || digitsOnly.length > 15) {
      phoneError = "Longueur du numéro de téléphone invalide (entre 5 et 15 chiffres attendus).";
    }
  }

  const errors = {
    fullName: nameError,
    title: titleError,
    phone: phoneError,
    email: emailError
  };

  const hasErrors = !!nameError || !!titleError || !!emailError || !!phoneError;

  // Generate html by mixing employee data and active country config
  const html = generateSignatureHtml({
    ...data,
    phone: (data.phone && activeCountry?.phonePrefix)
      ? `${activeCountry.phonePrefix} ${data.phone}`
      : data.phone,
    countryId: activeCountry?.id,
    websiteUrl: activeCountry?.websiteUrl,
    utmSource: activeCountry?.utmSource,
    utmMedium: activeCountry?.utmMedium,
    utmCampaign: activeCountry?.utmCampaign,
    activeSocials: activeCountry?.activeSocials,
    linkedinUrl: activeCountry?.linkedinUrl,
    xUrl: activeCountry?.xUrl,
    facebookUrl: activeCountry?.facebookUrl,
    instagramUrl: activeCountry?.instagramUrl,
    tiktokUrl: activeCountry?.tiktokUrl,
    youtubeUrl: activeCountry?.youtubeUrl,
    bannerUrl: activeCountry?.bannerUrl,
    bannerLink: activeCountry?.bannerLink,
  }, origin);

  // Draft operations
  const currentEditingCountry = draftCountries.find(c => c.id === editingCountryId);

  const updateDraftCountry = (id: string, updatedFields: Partial<CountryConfig>) => {
    setDraftCountries(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const addNewCountryDraft = () => {
    const newId = "country-" + Date.now();
    const newCountry: CountryConfig = {
      id: newId,
      name: "Nouveau pays",
      language: "fr",
      websiteUrl: "https://papslogistics.com",
      utmSource: "signature",
      utmMedium: "email",
      utmCampaign: "sig-new",
      activeSocials: ["LinkedIn", "X", "Facebook", "Instagram"],
      linkedinUrl: "https://www.linkedin.com/company/paps",
      xUrl: "https://x.com/papslogistics",
      facebookUrl: "https://www.facebook.com/Papsapp/",
      instagramUrl: "https://www.instagram.com/paps_sn",
      bannerUrl: "",
      bannerLink: "",
      phonePrefix: "+221"
    };
    setDraftCountries(prev => [...prev, newCountry]);
    setEditingCountryId(newId);
  };

  const deleteCountryDraft = (id: string) => {
    const remaining = draftCountries.filter(c => c.id !== id);
    setDraftCountries(remaining);
    if (editingCountryId === id) {
      if (remaining.length > 0) {
        setEditingCountryId(remaining[0].id);
      } else {
        setEditingCountryId(null);
      }
    }
  };

  const toggleDraftSocial = (id: string, social: string) => {
    const country = draftCountries.find(c => c.id === id);
    if (!country) return;
    const currentSocials = country.activeSocials;
    const updatedSocials = currentSocials.includes(social)
      ? currentSocials.filter(s => s !== social)
      : [...currentSocials, social];
    updateDraftCountry(id, { activeSocials: updatedSocials });
  };

  const saveAllChanges = () => {
    // Save draftCountries to main countries state and LocalStorage
    setCountries(draftCountries);
    localStorage.setItem("paps_signature_countries", JSON.stringify(draftCountries));

    // Reset selectedCountryId if it was deleted
    if (!draftCountries.some(c => c.id === selectedCountryId) && draftCountries.length > 0) {
      setSelectedCountryId(draftCountries[0].id);
    }

    // Persist to server-side CSV file database
    fetch("/api/save-countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftCountries),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to write to CSV database on server");
        return res.json();
      })
      .then(data => {
        console.log("Successfully synced configurations to countries.csv on the server.", data);
      })
      .catch(err => {
        console.error("Error saving configurations to server CSV database:", err);
      });

    // Trigger Success Notification Banner
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 3000);

    // Trigger Canvas Confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const triggerCsvDownload = () => {
    const csvString = exportToCSV(countries);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "countries.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msgBuffer = new TextEncoder().encode(adminPassword);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      const ADMIN_HASH = "882612286651aa40afc4cf80e2a2ec57d528949d8ee2d2cdc23fcb75c6256104";
      
      if (hashHex === ADMIN_HASH) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem("paps_admin_auth", "true");
        setPasswordError("");
      } else {
        setPasswordError("Mot de passe incorrect.");
      }
    } catch (err) {
      console.error("Crypto error:", err);
      setPasswordError("Erreur lors de la validation du mot de passe.");
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative">
      {/* Toast Notification */}
      {showSuccessNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-green-600 text-white px-5 py-3.5 rounded-xl shadow-xl font-semibold border border-green-500 transition-all transform animate-bounce">
          <span className="text-lg">✓</span>
          <span>Modifications enregistrées avec succès !</span>
        </div>
      )}

      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-paps.png"
            alt="PAPS"
            width={350}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-[#272F59]">
            {activeTab === "generator" ? t.generatorTitle : t.adminTitle}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeTab === "generator" ? t.generatorSubtitle : t.adminSubtitle}
          </p>
        </div>

        {/* Navigation Onglets */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "generator"
                ? "bg-[#272F59] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {t.tabGenerator}
          </button>
          <button
            onClick={() => {
              // Reset draft array from main countries array when entering admin to undo unsubmitted edits
              setDraftCountries(JSON.parse(JSON.stringify(countries)));
              if (countries.length > 0 && (!editingCountryId || !countries.some(c => c.id === editingCountryId))) {
                setEditingCountryId(countries[0].id);
              }
              setActiveTab("admin");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "bg-[#272F59] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {t.tabAdmin}
          </button>
        </div>
      </div>

      {/* Onglet Générateur */}
      {activeTab === "generator" && (
        <div className="space-y-6">
          {/* Selecteur de Pays */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#272F59]">{t.countrySelectorLabel} :</span>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.language.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            {activeCountry?.bannerUrl && (
              <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
                📢 Campagne active pour ce pays
              </div>
            )}
          </div>

          {/* Form et Prévisualisation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SignatureForm 
              data={data} 
              onChange={setData} 
              language={activeLanguage}
              errors={errors}
              countryId={activeCountry?.id || "sn"}
              phonePrefix={activeCountry?.phonePrefix || ""}
              touched={touchedFields}
              setTouched={setTouchedFields}
              submitAttempted={submitAttempted}
            />
            <SignaturePreview 
              html={html} 
              hasErrors={hasErrors} 
              onCopyAttempt={() => setSubmitAttempted(true)}
              submitAttempted={submitAttempted}
            />
          </div>

          {/* Tutoriel Loom */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src="https://www.loom.com/embed/15733f1334ee481593ebd00c3fbf61ef"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                title="Tutoriel installation signature Gmail"
              />
            </div>
          </div>

          {/* Gmail instructions */}
          <div>
            <GmailInstructions language={activeLanguage} />
          </div>
        </div>
      )}

      {/* Onglet Administration */}
      {activeTab === "admin" && (
        !isAdminAuthenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mt-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#272F59]/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#272F59]">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#272F59]">Administration</h2>
              <p className="text-sm text-gray-500 mt-1">Veuillez saisir le mot de passe pour accéder aux configurations.</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                    passwordError 
                      ? "border-red-400 focus:ring-red-400/20 focus:border-red-400" 
                      : "border-gray-200 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                  }`}
                />
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#272F59] text-white font-medium rounded-xl hover:bg-[#1e2547] active:scale-[0.98] transition-all shadow-md text-sm"
              >
                Déverrouiller
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des pays */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-[#272F59]">Pays</h3>
                <button
                  onClick={addNewCountryDraft}
                  className="px-3 py-1.5 bg-[#399EBF] text-white text-xs font-semibold rounded-lg hover:bg-[#2d87a4] transition-colors"
                >
                  + {t.adminFields.newCountry}
                </button>
              </div>
              
              {/* Country List */}
              <div className="space-y-2">
                {draftCountries.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setEditingCountryId(c.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                      editingCountryId === c.id
                        ? "bg-[#272F59]/5 border-[#272F59] font-medium"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm text-[#272F59]">{c.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">
                        {c.language}
                      </span>
                    </div>
                    {draftCountries.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCountryDraft(c.id);
                        }}
                        className="text-gray-400 hover:text-red-500 text-xs p-1 rounded transition-colors"
                        title={t.btnDelete}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Boutons CSV */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={triggerCsvDownload}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  📤 Exporter en CSV
                </button>
                <button
                  onClick={() => {
                    if (confirm("Réinitialiser toutes les configurations depuis le fichier CSV de base ? Vos modifications locales seront écrasées.")) {
                      loadFromCSV();
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  🔄 Réinitialiser depuis le CSV
                </button>
              </div>
            </div>

            {/* Formulaire d'édition */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {currentEditingCountry ? (
                <>
                  <h3 className="font-semibold text-[#272F59] mb-5">
                    {t.btnSave} : {currentEditingCountry.name || "..."}
                  </h3>

                  <div className="space-y-4">
                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t.adminFields.countryName}
                      </label>
                      <input
                        type="text"
                        value={currentEditingCountry.name}
                        onChange={(e) => updateDraftCountry(currentEditingCountry.id, { name: e.target.value })}
                        placeholder="Ex: Bénin"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                      />
                    </div>

                    {/* Langue & Indicatif */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {t.adminFields.countryLanguage}
                        </label>
                        <select
                          value={currentEditingCountry.language}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { language: e.target.value as Language })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        >
                          <option value="fr">Français (FR)</option>
                          <option value="pt">Português (PT)</option>
                          <option value="en">English (EN)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Indicatif Téléphonique (ex: +221)
                        </label>
                        <input
                          type="text"
                          value={currentEditingCountry.phonePrefix || ""}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { phonePrefix: e.target.value })}
                          placeholder="Ex: +221"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                    </div>

                    {/* URL du site */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {t.adminFields.websiteUrl}
                      </label>
                      <input
                        type="url"
                        value={currentEditingCountry.websiteUrl}
                        onChange={(e) => updateDraftCountry(currentEditingCountry.id, { websiteUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                      />
                    </div>

                    {/* UTMs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t.adminFields.utmSource}
                        </label>
                        <input
                          type="text"
                          value={currentEditingCountry.utmSource}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { utmSource: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t.adminFields.utmMedium}
                        </label>
                        <input
                          type="text"
                          value={currentEditingCountry.utmMedium}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { utmMedium: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          {t.adminFields.utmCampaign}
                        </label>
                        <input
                          type="text"
                          value={currentEditingCountry.utmCampaign}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { utmCampaign: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                    </div>

                    {/* Réseaux sociaux actifs */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.adminFields.activeSocials}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {ALL_SOCIALS.map((social) => (
                          <label
                            key={social}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-all text-xs font-medium ${
                              currentEditingCountry.activeSocials.includes(social)
                                ? "bg-[#399EBF]/10 border-[#399EBF] text-[#2d87a4]"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={currentEditingCountry.activeSocials.includes(social)}
                              onChange={() => toggleDraftSocial(currentEditingCountry.id, social)}
                              className="rounded text-[#399EBF] focus:ring-[#399EBF] border-gray-300 w-4 h-4"
                            />
                            {social}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* URLs des réseaux sociaux actifs */}
                    {currentEditingCountry.activeSocials.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">🔗 Liens spécifiques par pays</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentEditingCountry.activeSocials.includes("LinkedIn") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL LinkedIn</label>
                              <input
                                type="url"
                                value={currentEditingCountry.linkedinUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { linkedinUrl: e.target.value })}
                                placeholder="https://linkedin.com/company/paps"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                          {currentEditingCountry.activeSocials.includes("X") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL X (Twitter)</label>
                              <input
                                type="url"
                                value={currentEditingCountry.xUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { xUrl: e.target.value })}
                                placeholder="https://x.com/papslogistics"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                          {currentEditingCountry.activeSocials.includes("Facebook") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL Facebook</label>
                              <input
                                type="url"
                                value={currentEditingCountry.facebookUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { facebookUrl: e.target.value })}
                                placeholder="https://facebook.com/Papsapp/"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                          {currentEditingCountry.activeSocials.includes("Instagram") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL Instagram</label>
                              <input
                                type="url"
                                value={currentEditingCountry.instagramUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/paps_sn"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                          {currentEditingCountry.activeSocials.includes("TikTok") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL TikTok</label>
                              <input
                                type="url"
                                value={currentEditingCountry.tiktokUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { tiktokUrl: e.target.value })}
                                placeholder="https://tiktok.com/@papslogistics"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                          {currentEditingCountry.activeSocials.includes("YouTube") && (
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">URL YouTube</label>
                              <input
                                type="url"
                                value={currentEditingCountry.youtubeUrl || ""}
                                onChange={(e) => updateDraftCountry(currentEditingCountry.id, { youtubeUrl: e.target.value })}
                                placeholder="https://youtube.com/@papsapp"
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bannières de campagne */}
                    <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
                      <h4 className="text-sm font-semibold text-[#272F59]">📢 Campagne marketing (Bannière)</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {t.adminFields.bannerUrl}
                        </label>
                        <input
                          type="text"
                          value={currentEditingCountry.bannerUrl || ""}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { bannerUrl: e.target.value })}
                          placeholder="Lien direct (image/GIF) - largeur maximum calée sur 480px"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          {t.adminFields.bannerLink}
                        </label>
                        <input
                          type="url"
                          value={currentEditingCountry.bannerLink || ""}
                          onChange={(e) => updateDraftCountry(currentEditingCountry.id, { bannerLink: e.target.value })}
                          placeholder="Lien de redirection (ex: https://papslogistics.com/promo)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                        />
                      </div>
                    </div>

                    {/* Boutons d'actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                      <button
                        onClick={saveAllChanges}
                        className="px-6 py-2.5 bg-[#272F59] text-white text-sm font-medium rounded-lg hover:bg-[#1e2547] active:scale-95 transition-all shadow-md"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  Veuillez sélectionner ou ajouter un pays à configurer.
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
