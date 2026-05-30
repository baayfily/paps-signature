import { NextRequest, NextResponse } from "next/server";
import { getCountriesFromCSV } from "@/lib/csvHelper";

function formatWebsiteUrl(url: string, source?: string, medium?: string, campaign?: string): string {
  if (!url) return 'https://papslogistics.com';
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get("country");
  
  let targetUrl = "https://papslogistics.com";
  
  if (countryId) {
    const countries = getCountriesFromCSV();
    const country = countries.find(c => c.id === countryId);
    
    if (country) {
      if (country.bannerLink) {
        targetUrl = country.bannerLink;
      } else {
        // Fallback to website URL with UTMs
        targetUrl = formatWebsiteUrl(
          country.websiteUrl,
          country.utmSource,
          country.utmMedium,
          country.utmCampaign
        );
      }
    }
  }
  
  return NextResponse.redirect(targetUrl, { status: 302 });
}
