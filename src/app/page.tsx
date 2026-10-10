// Dueño: perfil 1 (entrada y demanda). Landing: problema en una frase + "Soy empresa" / "Soy estudiante". Ver docs/PRD.md §8 P1.
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">El CV dice lo que hiciste. Aquí demuestras lo que sabes hacer.</h1>
      <div className="mt-6 flex gap-3">
        <Link className="rounded border px-4 py-2" href="/registro?rol=empresa">Soy empresa</Link>
        <Link className="rounded border px-4 py-2" href="/registro?rol=estudiante">Soy estudiante</Link>
      </div>
    </main>
  );
}
