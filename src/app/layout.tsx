import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, IBM_Plex_Mono, Lobster, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Tipografías de la marca (docs/BRANDING.md): Fraunces para títulos, Source Sans 3 para texto
// e IBM Plex Mono para etiquetas y cifras. Lobster y Raleway solo para la marca (escudo y caligrafía).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "700"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], weight: ["400", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["500"] });
const lobster = Lobster({ variable: "--font-lobster", subsets: ["latin"], weight: "400" });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["800"] });

export const metadata: Metadata = {
  title: "Retos reales · Club Hispanidad Futura",
  description: "Retos reales online de empresas para estudiantes de España y Latinoamérica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable} ${lobster.variable} ${raleway.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
