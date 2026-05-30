export type Language = 'fr' | 'pt' | 'en';

export interface Translations {
  generatorTitle: string;
  generatorSubtitle: string;
  adminTitle: string;
  adminSubtitle: string;
  tabGenerator: string;
  tabAdmin: string;
  countrySelectorLabel: string;
  formTitle: string;
  previewTitle: string;
  btnCopy: string;
  btnCopied: string;
  btnSave: string;
  btnDelete: string;
  btnAddCountry: string;
  btnCancel: string;
  instructionTitle: string;
  instructions: string[];
  fields: {
    intro: string;
    fullName: string;
    title: string;
    phone: string;
    email: string;
    linkLabel: string;
    linkUrl: string;
  };
  adminFields: {
    countryName: string;
    countryLanguage: string;
    websiteUrl: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    activeSocials: string;
    bannerUrl: string;
    bannerLink: string;
    newCountry: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    generatorTitle: "Générateur de signature email",
    generatorSubtitle: "Remplissez le formulaire — la prévisualisation se met à jour en temps réel.",
    adminTitle: "Administration PAPS",
    adminSubtitle: "Gerez les configurations globales par pays (sauvegarde localement).",
    tabGenerator: "Générateur",
    tabAdmin: "Administration",
    countrySelectorLabel: "Pays de rattachement",
    formTitle: "Vos informations",
    previewTitle: "Prévisualisation",
    btnCopy: "Copier la signature",
    btnCopied: "✓ Copié !",
    btnSave: "Sauvegarder",
    btnDelete: "Supprimer",
    btnAddCountry: "Ajouter un pays",
    btnCancel: "Annuler",
    instructionTitle: "Comment installer dans Gmail",
    instructions: [
      'Cliquez sur "Copier la signature" ci-dessus.',
      "Ouvrez Gmail → ⚙️ Paramètres → Voir tous les paramètres.",
      'Onglet "Général" → section "Signature" → créez ou sélectionnez une signature.',
      "Cliquez dans la zone de texte de la signature (éditeur riche).",
      "Collez directement avec Cmd+V (Mac) ou Ctrl+V (Windows). La signature s'affiche mise en forme.",
      '"Enregistrer les modifications" en bas de la page. C\'est tout !'
    ],
    fields: {
      intro: "Formule d'intro",
      fullName: "Nom complet *",
      title: "Poste",
      phone: "Téléphone",
      email: "Email",
      linkLabel: "Intitulé du lien",
      linkUrl: "URL du lien"
    },
    adminFields: {
      countryName: "Nom du pays",
      countryLanguage: "Langue de l'interface",
      websiteUrl: "Lien site internet de base",
      utmSource: "UTM Source",
      utmMedium: "UTM Medium",
      utmCampaign: "UTM Campaign",
      activeSocials: "Réseaux sociaux actifs",
      bannerUrl: "URL de la bannière (Image/GIF) de campagne",
      bannerLink: "Lien de redirection de la bannière",
      newCountry: "Nouveau pays"
    }
  },
  pt: {
    generatorTitle: "Gerador de assinatura de e-mail",
    generatorSubtitle: "Preencha o formulário — a pré-visualização é atualizada em tempo real.",
    adminTitle: "Administração PAPS",
    adminSubtitle: "Gerencie as configurações globais por país (salvo localmente).",
    tabGenerator: "Gerador",
    tabAdmin: "Administração",
    countrySelectorLabel: "País de afiliação",
    formTitle: "Suas informações",
    previewTitle: "Pré-visualização",
    btnCopy: "Copiar assinatura",
    btnCopied: "✓ Copiado !",
    btnSave: "Salvar",
    btnDelete: "Excluir",
    btnAddCountry: "Adicionar país",
    btnCancel: "Cancelar",
    instructionTitle: "Como instalar no Gmail",
    instructions: [
      'Clique em "Copiar assinatura" acima.',
      "Abra o Gmail → ⚙️ Configurações → Ver todas as configurações.",
      'Aba "Geral" → seção "Assinatura" → crie ou selecione uma assinatura.',
      "Clique na área de texto da assinatura (editor rico).",
      "Cole diretamente com Cmd+V (Mac) ou Ctrl+V (Windows). A assinatura será exibida formatada.",
      '"Salvar alterações" no final da página. É tudo !'
    ],
    fields: {
      intro: "Fórmula de introdução",
      fullName: "Nome completo *",
      title: "Cargo",
      phone: "Telefone",
      email: "E-mail",
      linkLabel: "Texto do link",
      linkUrl: "URL do link"
    },
    adminFields: {
      countryName: "Nome do país",
      countryLanguage: "Idioma da interface",
      websiteUrl: "Link do site principal",
      utmSource: "UTM Source",
      utmMedium: "UTM Medium",
      utmCampaign: "UTM Campaign",
      activeSocials: "Redes sociais ativas",
      bannerUrl: "URL do banner (Imagem/GIF) de campanha",
      bannerLink: "Link de redirecionamento do banner",
      newCountry: "Novo país"
    }
  },
  en: {
    generatorTitle: "Email Signature Generator",
    generatorSubtitle: "Fill out the form — the preview updates in real time.",
    adminTitle: "PAPS Administration",
    adminSubtitle: "Manage global settings per country (saved locally).",
    tabGenerator: "Generator",
    tabAdmin: "Administration",
    countrySelectorLabel: "Affiliation Country",
    formTitle: "Your Information",
    previewTitle: "Preview",
    btnCopy: "Copy Signature",
    btnCopied: "✓ Copied!",
    btnSave: "Save Settings",
    btnDelete: "Delete",
    btnAddCountry: "Add Country",
    btnCancel: "Cancel",
    instructionTitle: "How to install in Gmail",
    instructions: [
      'Click "Copy Signature" above.',
      "Open Gmail → ⚙️ Settings → See all settings.",
      'Tab "General" → "Signature" section → create or select a signature.',
      "Click inside the signature text area (rich editor).",
      "Paste directly with Cmd+V (Mac) or Ctrl+V (Windows). The signature appears formatted.",
      'Click "Save Changes" at the bottom of the page. That\'s it!'
    ],
    fields: {
      intro: "Intro phrase",
      fullName: "Full Name *",
      title: "Job Title",
      phone: "Phone Number",
      email: "Email",
      linkLabel: "Link text",
      linkUrl: "Link URL"
    },
    adminFields: {
      countryName: "Country name",
      countryLanguage: "Interface language",
      websiteUrl: "Base Website URL",
      utmSource: "UTM Source",
      utmMedium: "UTM Medium",
      utmCampaign: "UTM Campaign",
      activeSocials: "Active social networks",
      bannerUrl: "Campaign banner URL (Image/GIF)",
      bannerLink: "Banner redirection link",
      newCountry: "New Country"
    }
  }
};
