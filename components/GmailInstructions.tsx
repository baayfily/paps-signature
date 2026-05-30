"use client";

import { useState } from "react";
import { type Language, TRANSLATIONS } from "@/lib/translations";

interface Props {
  language: Language;
}

export default function GmailInstructions({ language }: Props) {
  const [open, setOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-[#272F59]">
          {t.instructionTitle}
        </span>
        <span className="text-gray-400 text-lg font-light select-none">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-50">
          <ol className="mt-4 space-y-3">
            {t.instructions.map((step, i) => (
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
