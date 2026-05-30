"use client";

import { type SignatureData } from "@/lib/generateHtml";
import { type Language, TRANSLATIONS } from "@/lib/translations";
import { formatPhoneLocalNumber } from "@/lib/phoneFormatter";

interface Props {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  language: Language;
  errors: Record<string, string | null>;
  countryId: string;
  phonePrefix: string;
  touched: Record<string, boolean>;
  setTouched: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  submitAttempted: boolean;
}

export default function SignatureForm({ 
  data, 
  onChange, 
  language, 
  errors,
  countryId,
  phonePrefix,
  touched,
  setTouched,
  submitAttempted
}: Props) {
  const t = TRANSLATIONS[language];
  
  const set = (key: keyof SignatureData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneLocalNumber(rawVal, countryId);
    onChange({ ...data, phone: formatted });
  };

  const getPhonePlaceholder = () => {
    if (countryId === "sn") return "78 432 07 07";
    if (countryId === "ci") return "07 12 34 56 78";
    if (countryId === "cv") return "991 23 45";
    return "77 123 45 67";
  };

  const fields: {
    key: keyof SignatureData;
    label: string;
    placeholder: string;
    type: string;
  }[] = [
    { key: "fullName", label: t.fields.fullName, placeholder: "Baye Fily MBENGUE", type: "text" },
    { key: "title", label: t.fields.title, placeholder: "Head of Marketing", type: "text" },
    { key: "phone", label: t.fields.phone, placeholder: getPhonePlaceholder(), type: "tel" },
    { key: "email", label: t.fields.email, placeholder: "prenom.nom@paps-app.com", type: "email" },
    { key: "linkLabel", label: t.fields.linkLabel, placeholder: "Planifions un échange (optionnel)", type: "text" },
    { key: "linkUrl", label: t.fields.linkUrl, placeholder: "https://calendly.com/... (optionnel)", type: "url" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-[#272F59] mb-5">{t.formTitle}</h2>
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, type }) => {
          const errorMsg = errors[key];
          const shouldShowError = !!errorMsg && (touched[key] || submitAttempted);
          const hasError = shouldShowError;

          if (key === "phone") {
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <div className={`flex rounded-lg border transition-colors overflow-hidden ${
                  hasError
                    ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/20 focus-within:border-red-400"
                    : "border-gray-200 focus-within:ring-2 focus-within:ring-[#399EBF]/20 focus-within:border-[#399EBF]"
                }`}>
                  {phonePrefix && (
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 font-semibold border-r border-gray-200 select-none">
                      {phonePrefix}
                    </span>
                  )}
                  <input
                    type="tel"
                    value={(data[key] as string) || ""}
                    onChange={handlePhoneChange}
                    onBlur={() => setTouched(prev => ({ ...prev, [key]: true }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none"
                  />
                </div>
                {hasError && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{errorMsg}</p>
                )}
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={(data[key] as string) || ""}
                onChange={set(key)}
                onBlur={() => setTouched(prev => ({ ...prev, [key]: true }))}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition-colors ${
                  hasError
                    ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
                    : "border-gray-200 focus:ring-[#399EBF]/40 focus:border-[#399EBF]"
                }`}
              />
              {hasError && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{errorMsg}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
