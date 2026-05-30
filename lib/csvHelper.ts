import fs from 'fs';
import path from 'path';
import { type CountryConfig } from './defaultCountries';
import { type Language } from './translations';

// Client/Server side parser for the CSV configuration file
export function parseCSV(text: string): CountryConfig[] {
  const lines = text.split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const list: CountryConfig[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split on commas but respect double quotes
    const values: string[] = [];
    let currentVal = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());
    
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      let val = values[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      row[h] = val;
    });
    
    const activeSocials = row['activeSocials']
      ? row['activeSocials'].split(';').map((s: string) => s.trim()).filter(Boolean)
      : [];
      
    list.push({
      id: row['id'] || ('country-' + i),
      name: row['name'] || 'Inconnu',
      language: (row['language'] || 'fr') as Language,
      websiteUrl: row['websiteUrl'] || 'https://papslogistics.com',
      utmSource: row['utmSource'] || '',
      utmMedium: row['utmMedium'] || '',
      utmCampaign: row['utmCampaign'] || '',
      activeSocials,
      linkedinUrl: row['linkedinUrl'] || '',
      xUrl: row['xUrl'] || '',
      facebookUrl: row['facebookUrl'] || '',
      instagramUrl: row['instagramUrl'] || '',
      tiktokUrl: row['tiktokUrl'] || '',
      youtubeUrl: row['youtubeUrl'] || '',
      bannerUrl: row['bannerUrl'] || '',
      bannerLink: row['bannerLink'] || '',
      phonePrefix: row['phonePrefix'] || ''
    });
  }
  return list;
}

export function getCountriesFromCSV(): CountryConfig[] {
  try {
    const csvPath = path.join(process.cwd(), 'public', 'countries.csv');
    if (!fs.existsSync(csvPath)) {
      console.warn("CSV file not found at:", csvPath);
      return [];
    }
    const text = fs.readFileSync(csvPath, 'utf8');
    return parseCSV(text);
  } catch (err) {
    console.error("Error reading CSV:", err);
    return [];
  }
}
