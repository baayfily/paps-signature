import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { type CountryConfig } from "@/lib/defaultCountries";

function convertToCSV(countriesList: CountryConfig[]): string {
  const headers = [
    'id', 'name', 'language', 'websiteUrl', 'utmSource', 'utmMedium', 'utmCampaign',
    'activeSocials', 'linkedinUrl', 'xUrl', 'facebookUrl', 'instagramUrl', 'tiktokUrl', 'youtubeUrl',
    'bannerUrl', 'bannerLink', 'phonePrefix'
  ];
  
  const csvRows = [headers.join(',')];
  
  countriesList.forEach(c => {
    const values = [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.language,
      c.websiteUrl,
      c.utmSource,
      c.utmMedium,
      c.utmCampaign,
      `"${c.activeSocials.join(';')}"`,
      c.linkedinUrl || '',
      c.xUrl || '',
      c.facebookUrl || '',
      c.instagramUrl || '',
      c.tiktokUrl || '',
      c.youtubeUrl || '',
      c.bannerUrl || '',
      c.bannerLink || '',
      c.phonePrefix || ''
    ];
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const draftCountries = await request.json() as CountryConfig[];
    
    if (!Array.isArray(draftCountries)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    const csvString = convertToCSV(draftCountries);
    const csvPath = path.join(process.cwd(), 'public', 'countries.csv');
    
    fs.writeFileSync(csvPath, csvString, 'utf8');
    
    return NextResponse.json({ success: true, count: draftCountries.length });
  } catch (err) {
    console.error("Error saving CSV database:", err);
    const errorMsg = err instanceof Error ? err.message : "Failed to save CSV";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
