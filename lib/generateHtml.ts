export interface SignatureData {
  intro: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  linkLabel: string;
  linkUrl: string;
  countryId?: string;
  // Pays et campagnes
  websiteUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  activeSocials?: string[];
  linkedinUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  bannerUrl?: string;
  bannerLink?: string;
}

const SITE_URL = 'https://papslogistics.com';
const FONT = "'Montserrat', Arial, sans-serif";
const NAVY = '#272F59';
const STEEL = '#399EBF';

// Icônes via Iconify API (CDN public, gratuit, PNG/SVG avec paramètre couleur)
// LinkedIn ne fonctionnait pas via cdn.simpleicons.org — on utilise Iconify pour toute la cohérence
const SOCIAL_TEMPLATES = [
  { name: 'LinkedIn',  imgSrc: 'https://api.iconify.design/simple-icons:linkedin.svg?color=%23F4991A' },
  { name: 'X',         imgSrc: 'https://cdn.simpleicons.org/x/F4991A' },
  { name: 'Facebook',  imgSrc: 'https://cdn.simpleicons.org/facebook/F4991A' },
  { name: 'Instagram', imgSrc: 'https://cdn.simpleicons.org/instagram/F4991A' },
  { name: 'TikTok',    imgSrc: 'https://cdn.simpleicons.org/tiktok/F4991A' },
  { name: 'YouTube',   imgSrc: 'https://cdn.simpleicons.org/youtube/F4991A' },
];

function spacer(h = 8): string {
  return `<tr><td style="font-size:0;line-height:${h}px;height:${h}px;">&nbsp;</td></tr>`;
}

function textRow(content: string): string {
  return `<tr><td style="font-family:${FONT};font-size:14px;color:${NAVY};">${content}</td></tr>`;
}

function linkHtml(href: string, text: string): string {
  return `<a href="${href}" style="color:${STEEL};text-decoration:underline;font-family:${FONT};font-size:14px;">${text}</a>`;
}

function socialIconCell(s: { name: string; url: string; imgSrc: string }, last: boolean): string {
  return `<td style="padding:20px ${last ? '0' : '15px'} 0 0;vertical-align:middle;text-align:center;width:20px;height:20px;">
  <a href="${s.url}" target="_blank" style="text-decoration:none;display:inline-block;line-height:0;">
    <img src="${s.imgSrc}" alt="${s.name}" width="20" height="20" style="display:block;border:0;margin:0;" />
  </a>
</td>`;
}

function formatWebsiteUrl(url: string, source?: string, medium?: string, campaign?: string): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (source) u.searchParams.set('utm_source', source);
    if (medium) u.searchParams.set('utm_medium', medium);
    if (campaign) u.searchParams.set('utm_campaign', campaign);
    return u.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    let formatted = url;
    const params = [];
    if (source) params.push(`utm_source=${encodeURIComponent(source)}`);
    if (medium) params.push(`utm_medium=${encodeURIComponent(medium)}`);
    if (campaign) params.push(`utm_campaign=${encodeURIComponent(campaign)}`);
    if (params.length > 0) {
      formatted += separator + params.join('&');
    }
    return formatted;
  }
}

export function generateSignatureHtml(data: SignatureData, origin?: string): string {
  const parts: string[] = [];
  const logoUrl = origin ? `${origin}/logo-paps.png` : '/logo-paps.png';
  const siteUrl = data.websiteUrl || SITE_URL;
  const formattedSiteUrl = formatWebsiteUrl(siteUrl, data.utmSource, data.utmMedium, data.utmCampaign);
  const displayDomain = siteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

  // Formule d'intro forcée à "Your friend,"
  parts.push(textRow('--'));
  parts.push(spacer(4));
  parts.push(textRow("Your friend,"));
  parts.push(spacer(12));

  if (data.fullName) {
    parts.push(
      `<tr><td style="font-family:${FONT};font-weight:700;font-size:15px;color:${NAVY};">${data.fullName}</td></tr>`
    );
  }

  if (data.title) {
    parts.push(textRow(data.title));
  }

  if (data.phone) {
    // href sans espaces pour compatibilité tel: — affichage tel que saisi
    const telHref = `tel:${data.phone.replace(/\s+/g, '')}`;
    parts.push(textRow(`Téléphone:&nbsp;${linkHtml(telHref, data.phone)}`));
  }

  parts.push(spacer(8));

  if (data.email) {
    parts.push(`<tr><td>${linkHtml(`mailto:${data.email}`, data.email)}</td></tr>`);
  }

  if (data.linkUrl && data.linkLabel) {
    parts.push(`<tr><td>${linkHtml(data.linkUrl, data.linkLabel)}</td></tr>`);
  }

  parts.push(spacer(8));

  parts.push(`<tr><td>
  <a href="${formattedSiteUrl}" target="_blank" style="text-decoration:none;">
    <img src="${logoUrl}" alt="PAPS" width="240" style="display:block;border:0;" referrerpolicy="no-referrer" />
  </a>
</td></tr>`);

  parts.push(spacer(6));

  parts.push(`<tr><td>${linkHtml(formattedSiteUrl, displayDomain)}</td></tr>`);

  parts.push(spacer(6));

  const activeSocialsNames = data.activeSocials && data.activeSocials.length > 0
    ? data.activeSocials
    : SOCIAL_TEMPLATES.map(s => s.name);

  const activeSocials: { name: string; url: string; imgSrc: string }[] = [];
  
  SOCIAL_TEMPLATES.forEach(s => {
    if (activeSocialsNames.includes(s.name)) {
      let customUrl = '';
      if (s.name === 'LinkedIn') customUrl = data.linkedinUrl || 'https://www.linkedin.com/company/paps';
      else if (s.name === 'X') customUrl = data.xUrl || 'https://x.com/papslogistics';
      else if (s.name === 'Facebook') customUrl = data.facebookUrl || 'https://www.facebook.com/Papsapp/';
      else if (s.name === 'Instagram') customUrl = data.instagramUrl || 'https://www.instagram.com/paps_sn';
      else if (s.name === 'TikTok') customUrl = data.tiktokUrl || 'https://www.tiktok.com/@papslogistics';
      else if (s.name === 'YouTube') customUrl = data.youtubeUrl || 'https://www.youtube.com/@papsapp';

      if (customUrl) {
        activeSocials.push({
          name: s.name,
          url: customUrl,
          imgSrc: s.imgSrc
        });
      }
    }
  });

  const iconCells = activeSocials.map((s, i) => socialIconCell(s, i === activeSocials.length - 1)).join('');

  if (iconCells) {
    parts.push(`<tr><td>
    <table cellpadding="0" cellspacing="0" border="0"><tbody>
      <tr>${iconCells}</tr>
    </tbody></table>
  </td></tr>`);
  }

  if (data.countryId) {
    const baseApiUrl = origin || '';
    const bannerImg = `<img src="${baseApiUrl}/api/campaign-image?country=${data.countryId}" alt="PAPS Campagne" width="480" style="display:block;border:0;width:480px;max-width:480px;" />`;
    const bannerContent = `<a href="${baseApiUrl}/api/campaign-link?country=${data.countryId}" target="_blank" style="text-decoration:none;display:block;">${bannerImg}</a>`;
    
    parts.push(spacer(15));
    parts.push(`<tr><td>${bannerContent}</td></tr>`);
  }

  return `<table cellpadding="0" cellspacing="0" border="0">
  <tbody>
${parts.join('\n')}
  </tbody>
</table>`;
}
