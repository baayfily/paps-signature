"use client";

import { useState } from "react";

const STEPS = [
  'Cliquez sur "Copier la signature" ci-dessus.',
  "Ouvrez Gmail → ⚙️ Paramètres → Voir tous les paramètres.",
  'Onglet "Général" → section "Signature" → créez ou sélectionnez une signature.',
  "Cliquez dans la zone de texte de la signature (éditeur riche).",
  "Collez directement avec Cmd+V (Mac) ou Ctrl+V (Windows). La signature s'affiche mise en forme.",
  '"Enregistrer les modifications" en bas de la page. C\'est tout !',
];

export default function GmailInstructions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-[#272F59]">
          Comment installer dans Gmail
        </span>
        <span className="text-gray-400 text-lg font-light select-none">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          <ol className="mt-4 space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#399EBF] text-white text-xs flex items-center justify-center font-semibold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
