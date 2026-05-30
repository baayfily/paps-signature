import { type Language } from './translations';

export interface CountryConfig {
  id: string;
  name: string;
  language: Language;
  websiteUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  activeSocials: string[];
  linkedinUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  bannerUrl?: string;
  bannerLink?: string;
  phonePrefix?: string;
}

export const DEFAULT_COUNTRIES: CountryConfig[] = [
  {
    id: "sn",
    name: "Sénégal",
    language: "fr",
    websiteUrl: "https://papslogistics.com",
    utmSource: "signature",
    utmMedium: "email",
    utmCampaign: "sig-sn",
    activeSocials: ["LinkedIn", "X", "Facebook", "Instagram", "TikTok", "YouTube"],
    linkedinUrl: "https://www.linkedin.com/company/paps",
    xUrl: "https://x.com/papslogistics",
    facebookUrl: "https://www.facebook.com/Papsapp/",
    instagramUrl: "https://www.instagram.com/paps_sn",
    tiktokUrl: "https://www.tiktok.com/@papslogistics",
    youtubeUrl: "https://www.youtube.com/@papsapp",
    bannerUrl: "",
    bannerLink: "",
    phonePrefix: "+221"
  },
  {
    id: "ci",
    name: "Côte d'Ivoire",
    language: "fr",
    websiteUrl: "https://papslogistics.com",
    utmSource: "signature",
    utmMedium: "email",
    utmCampaign: "sig-ci",
    activeSocials: ["LinkedIn", "Facebook", "Instagram"],
    linkedinUrl: "https://www.linkedin.com/company/paps",
    facebookUrl: "https://www.facebook.com/Papsapp/",
    instagramUrl: "https://www.instagram.com/paps_sn",
    bannerUrl: "",
    bannerLink: "",
    phonePrefix: "+225"
  },
  {
    id: "cv",
    name: "Cap-Vert",
    language: "pt",
    websiteUrl: "https://papslogistics.com",
    utmSource: "signature",
    utmMedium: "email",
    utmCampaign: "sig-cv",
    activeSocials: ["LinkedIn", "Facebook", "Instagram"],
    linkedinUrl: "https://www.linkedin.com/company/paps",
    facebookUrl: "https://www.facebook.com/Papsapp/",
    instagramUrl: "https://www.instagram.com/paps_sn",
    bannerUrl: "",
    bannerLink: "",
    phonePrefix: "+238"
  }
];
