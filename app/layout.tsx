import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PAPS — Générateur de signature email",
  description: "Générez votre signature email PAPS pour Gmail en quelques secondes.",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTVlHHlYNF-T78YsSMro0lgxpqRTOnmO8Tmw&s",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} font-sans antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
