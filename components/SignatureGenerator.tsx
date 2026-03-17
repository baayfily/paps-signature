"use client";

import { useState } from "react";
import SignatureForm from "./SignatureForm";
import SignaturePreview from "./SignaturePreview";
import GmailInstructions from "./GmailInstructions";
import { generateSignatureHtml, type SignatureData } from "@/lib/generateHtml";

const DEFAULT_DATA: SignatureData = {
  intro: "Your friend,",
  fullName: "",
  title: "",
  phone: "",
  email: "",
  linkLabel: "",
  linkUrl: "",
};

export default function SignatureGenerator() {
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);

  const html = generateSignatureHtml(data);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ci3.googleusercontent.com/mail-sig/AIorK4wgvGg5d5rVCXusXC2gfB485CKHWHMSvhIrZ_RvOvUtp96wynKcyjsT7BrD5DnAeHmaE3TGrDvbV1NP"
          alt="PAPS"
          width={350}
          referrerPolicy="no-referrer"
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-[#272F59]">
          Générateur de signature email
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Remplissez le formulaire — la prévisualisation se met à jour en temps réel.
        </p>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignatureForm data={data} onChange={setData} />
        <SignaturePreview html={html} />
      </div>

      {/* Loom tutorial */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
      <div className="mt-6">
        <GmailInstructions />
      </div>
    </div>
  );
}
