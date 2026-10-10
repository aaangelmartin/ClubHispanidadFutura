// Dueño: perfil 1 (entrada y demanda). Landing «pasaporte de talento»: cada sección vive en _landing/.
// Ver docs/PRD.md §1–3 y §8 P1.
import { contarEstudiantes } from "./panel/queries";
import Hero from "./_landing/Hero";
import SeccionSellos from "./_landing/SeccionSellos";
import SeccionEmpresas from "./_landing/SeccionEmpresas";
import Cierre from "./_landing/Cierre";
import p from "./_landing/pasaporte.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const registrados = await contarEstudiantes();
  return (
    <main className={`${p.page} overflow-x-clip`}>
      <Hero registrados={registrados} />
      <SeccionSellos />
      <SeccionEmpresas />
      <Cierre registrados={registrados} />
    </main>
  );
}
