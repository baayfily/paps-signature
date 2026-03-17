export interface SignatureData {
  intro: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  linkLabel: string;
  linkUrl: string;
}

const LOGO_URL =
  'https://ci3.googleusercontent.com/mail-sig/AIorK4wgvGg5d5rVCXusXC2gfB485CKHWHMSvhIrZ_RvOvUtp96wynKcyjsT7BrD5DnAeHmaE3TGrDvbV1NP';
const SITE_URL = 'https://papslogistics.com';
const FONT = "'Montserrat', Arial, sans-serif";
const NAVY = '#272F59';
const STEEL = '#399EBF';

// Icônes via Iconify API (CDN public, gratuit, PNG/SVG avec paramètre couleur)
// LinkedIn ne fonctionnait pas via cdn.simpleicons.org — on utilise Iconify pour toute la cohérence
const SOCIAL = [
  { name: 'LinkedIn',  url: 'https://www.linkedin.com/company/paps',  imgSrc: 'https://api.iconify.design/simple-icons:linkedin.svg?color=white' },
  { name: 'X',         url: 'https://x.com/papslogistics',             imgSrc: 'https://cdn.simpleicons.org/x/ffffff' },
  { name: 'Facebook',  url: 'https://www.facebook.com/Papsapp/',       imgSrc: 'https://cdn.simpleicons.org/facebook/ffffff' },
  { name: 'Instagram', url: 'https://www.instagram.com/paps_sn',       imgSrc: 'https://cdn.simpleicons.org/instagram/ffffff' },
  { name: 'TikTok',    url: 'https://www.tiktok.com/@papslogistics',   imgSrc: 'https://cdn.simpleicons.org/tiktok/ffffff' },
  { name: 'YouTube',   url: 'https://www.youtube.com/@papsapp',        imgSrc: 'https://cdn.simpleicons.org/youtube/ffffff' },
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

function socialIconCell(s: typeof SOCIAL[number], last: boolean): string {
  return `<td style="padding:0${last ? '' : ' 6px 0 0'};">
  <table cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="#000000" style="background-color:#000000;border-radius:5px;width:30px;height:30px;text-align:center;vertical-align:middle;">
        <a href="${s.url}" target="_blank" style="text-decoration:none;display:block;line-height:0;">
          <img src="${s.imgSrc}" alt="${s.name}" width="18" height="18" style="display:block;border:0;margin:6px;" />
        </a>
      </td>
    </tr>
  </table>
</td>`;
}

export function generateSignatureHtml(data: SignatureData): string {
  const parts: string[] = [];

  if (data.intro) {
    parts.push(textRow('--'));
    parts.push(spacer(4));
    parts.push(textRow(data.intro));
    parts.push(spacer(12));
  }

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
  <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
    <img src="${LOGO_URL}" alt="PAPS" width="240" style="display:block;border:0;" referrerpolicy="no-referrer" />
  </a>
</td></tr>`);

  parts.push(spacer(6));

  parts.push(`<tr><td>${linkHtml(SITE_URL, 'www.papslogistics.com')}</td></tr>`);

  parts.push(spacer(6));

  const iconCells = SOCIAL.map((s, i) => socialIconCell(s, i === SOCIAL.length - 1)).join('');

  parts.push(`<tr><td>
  <table cellpadding="0" cellspacing="0" border="0"><tbody>
    <tr>${iconCells}</tr>
  </tbody></table>
</td></tr>`);

  return `<table cellpadding="0" cellspacing="0" border="0">
  <tbody>
${parts.join('\n')}
  </tbody>
</table>`;
}
