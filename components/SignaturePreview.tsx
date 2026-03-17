"use client";

import { useState } from "react";

interface Props {
  html: string;
}

function iframeDoc(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="referrer" content="no-referrer"/>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/>
  <style>
    body { margin: 20px; font-family: 'Montserrat', Arial, sans-serif; background: #fff; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

export default function SignaturePreview({ html }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#272F59]">Prévisualisation</h2>
        <button
          onClick={copy}
          className="px-4 py-2 bg-[#272F59] text-white text-sm font-medium rounded-lg hover:bg-[#1e2547] active:scale-95 transition-all"
        >
          {copied ? "✓ Copié !" : "Copier la signature"}
        </button>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden flex-1 min-h-[380px] bg-white">
        <iframe
          srcDoc={iframeDoc(html)}
          className="w-full h-full"
          style={{ minHeight: 380, border: "none" }}
          title="Prévisualisation de la signature"
        />
      </div>
    </div>
  );
}
