// Dueño: perfil 4. Tipografías del lenguaje "pasaporte" de la landing (perfil 1): Archivo extendida para
// titulares y B612 Mono para datos. Mismas variables que usa la landing, así no chocan al fusionar.
import { Archivo, B612_Mono } from "next/font/google";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const b612 = B612_Mono({ variable: "--font-b612", subsets: ["latin"], weight: ["400", "700"] });

export const pasaporteFonts = `${archivo.variable} ${b612.variable}`;
