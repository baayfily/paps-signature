import { NextRequest, NextResponse } from "next/server";
import { getCountriesFromCSV } from "@/lib/csvHelper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get("country");
  
  if (countryId) {
    const countries = getCountriesFromCSV();
    const country = countries.find(c => c.id === countryId);
    
    if (country && country.bannerUrl) {
      // Redirect to the active campaign image
      return NextResponse.redirect(country.bannerUrl, { status: 302 });
    }
  }
  
  // Directly serve a 1x1 transparent PNG instead of redirecting to avoid broken image issues
  const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const buffer = Buffer.from(transparentPngBase64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "no-store, must-revalidate"
    }
  });
}
