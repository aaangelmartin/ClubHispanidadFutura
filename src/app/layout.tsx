import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, IBM_Plex_Mono, Lobster, Raleway, Archivo, B612_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Tipografías de la marca (docs/producto/BRANDING.md): Fraunces para títulos, Source Sans 3 para texto
// e IBM Plex Mono para etiquetas y cifras. Lobster y Raleway solo para la marca (escudo y caligrafía).
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "700"] });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], weight: ["400", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["500"] });
const lobster = Lobster({ variable: "--font-lobster", subsets: ["latin"], weight: "400" });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], weight: ["800"] });
// Landing (pasaporte de talento): Archivo extendida para titulares y B612 Mono para los datos del pasaporte.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
// Embarca: Hanken Grotesk para todo el texto y B612 Mono solo para códigos de documento (MRZ, rutas, puertas).
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const b612 = B612_Mono({ variable: "--font-b612", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Embarca · Retos reales de empresas · Club Hispanidad Futura",
  description: "Empresas de España y Colombia publican retos reales. Estudiantes los resuelven en días y cada entrega valorada queda en su pasaporte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable} ${lobster.variable} ${raleway.variable} ${archivo.variable} ${b612.variable} ${hanken.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
