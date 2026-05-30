import { NextRequest, NextResponse } from "next/server";
import { getCountriesFromCSV } from "@/lib/csvHelper";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const countryId = searchParams.get("country");
  
  if (countryId) {
    const countries = getCountriesFromCSV();
    const country = countries.find(c => c.id === countryId);
    
    if (country && country.bannerUrl) {
      // Redirect to the active campaign image
      return NextResponse.redirect(country.bannerUrl, { status: 302 });
    }
  }
  
  // Default to the 480x1 transparent PNG
  return NextResponse.redirect(`${origin}/transparent-480x1.png`, { status: 302 });
}
