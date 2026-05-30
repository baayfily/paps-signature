"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface Props {
  html: string;
  hasErrors: boolean;
  onCopyAttempt: () => void;
  submitAttempted: boolean;
}

function iframeDoc(body: string, theme: "light" | "dark"): string {
  const isDark = theme === "dark";
  const bgColor = isDark ? "#121212" : "#ffffff";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="referrer" content="no-referrer"/>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
  <style>
    body {
      margin: 20px;
      font-family: 'Montserrat', Arial, sans-serif;
      background: ${bgColor};
      transition: background-color 0.2s ease;
    }
    /* Simulation du comportement du client email en mode nuit */
    ${isDark ? `
    /* Force le texte sombre/navy à s'éclaircir */
    table, td, p, span {
      color: #f3f4f6 !important;
    }
    /* Force les liens à s'ajuster pour être lisibles sur fond sombre */
    a {
      color: #5ab0cf !important;
    }
    ` : ''}
  </style>
</head>
<body>${body}</body>
</html>`;
}

export default function SignaturePreview({ html, hasErrors, onCopyAttempt, submitAttempted }: Props) {
  const [copied, setCopied] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  const copy = async () => {
    onCopyAttempt();
    if (hasErrors) return;
    try {
      // Copie en texte riche — paste direct dans l'éditeur Gmail sans passer par le mode source
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }) }),
      ]);
    } catch {
      // Fallback navigateurs sans ClipboardItem
      await navigator.clipboard.writeText(html);
    }
    setCopied(true);
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-semibold text-[#272F59]">Prévisualisation</h2>
          {/* Toggle thèmes */}
          <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setPreviewTheme("light")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                previewTheme === "light"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              ☀️ Clair
            </button>
            <button
              onClick={() => setPreviewTheme("dark")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                previewTheme === "dark"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              🌙 Sombre
            </button>
          </div>
        </div>
        <button
          onClick={copy}
          className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all w-full sm:w-auto bg-[#272F59] hover:bg-[#1e2547] active:scale-95"
          title={submitAttempted && hasErrors ? "Veuillez corriger les erreurs de validation dans le formulaire." : undefined}
        >
          {copied ? "✓ Copié !" : "Copier la signature"}
        </button>
      </div>

      {submitAttempted && hasErrors && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>Veuillez corriger les erreurs dans le formulaire pour pouvoir copier la signature.</span>
        </div>
      )}

      <div className="border border-gray-100 rounded-xl overflow-hidden flex-1 min-h-[380px] bg-white">
        <iframe
          srcDoc={iframeDoc(html, previewTheme)}
          className="w-full h-full"
          style={{ minHeight: 380, border: "none" }}
          title="Prévisualisation de la signature"
        />
      </div>
    </div>
  );
}
