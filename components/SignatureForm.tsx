"use client";

import { type SignatureData } from "@/lib/generateHtml";

interface Props {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
}

const FIELDS: {
  key: keyof SignatureData;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  { key: "intro", label: "Formule d'intro", placeholder: "Your friend,", type: "text" },
  { key: "fullName", label: "Nom complet *", placeholder: "Baye Fily MBENGUE", type: "text" },
  { key: "title", label: "Poste", placeholder: "Head of Marketing", type: "text" },
  { key: "phone", label: "Téléphone", placeholder: "+221 78 432 07 07", type: "tel" },
  { key: "email", label: "Email", placeholder: "prenom.nom@paps-app.com", type: "email" },
  { key: "linkLabel", label: "Intitulé du lien", placeholder: "Planifions un échange", type: "text" },
  { key: "linkUrl", label: "URL du lien", placeholder: "https://calendly.com/...", type: "url" },
];

export default function SignatureForm({ data, onChange }: Props) {
  const set = (key: keyof SignatureData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-[#272F59] mb-5">Vos informations</h2>
      <div className="space-y-4">
        {FIELDS.map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input
              type={type}
              value={data[key]}
              onChange={set(key)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#399EBF]/40 focus:border-[#399EBF] transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
