// Dueño: perfil 2 (publicar retos). Ver docs/perfiles/2-publicar-retos.md y docs/EQUIPO.md.
import Link from "next/link";
import { deleteDraft } from "./actions";
import EditForm from "./EditForm";
import GenerateForm from "./GenerateForm";
import { getDraft, getDrafts, requireCompany } from "./queries";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ borrador?: string; publicado?: string; guardado?: string }>;
}) {
  const { borrador, publicado, guardado } = await searchParams;
  const company = await requireCompany();

  if (publicado) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="card flex flex-col items-start gap-4 p-8">
          <span className="eyebrow">Publicado</span>
          <h1 className="text-4xl font-bold">Reto publicado</h1>
          <p className="text-ink-2">Ya lo pueden ver los estudiantes de España y LatAm. Recibirás las entregas en tu panel.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/retos/${publicado}`} className="btn btn-primary">Ver el reto como estudiante</Link>
            <Link href="/empresa" className="btn">Ir a mis retos</Link>
            <Link href="/empresa/nuevo" className="btn">Publicar otro</Link>
          </div>
        </div>
      </main>
    );
  }

  if (borrador) {
    const draft = await getDraft(company.id, borrador);
    if (draft && draft.status === "borrador") {
      return (
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">{company.name} · borrador</span>
            <h1 className="text-4xl font-bold">Revisa tu reto</h1>
            <p className="text-ink-2">La IA ha preparado esta propuesta. Cámbiala como quieras y publícala cuando esté lista.</p>
          </div>
          <EditForm challenge={draft} saved={guardado === "1"} />
          <form action={deleteDraft}>
            <input type="hidden" name="id" value={draft.id} />
            <button type="submit" className="text-sm text-ink-3 underline">Descartar este borrador</button>
          </form>
        </main>
      );
    }
  }

  const drafts = await getDrafts(company.id);
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">{company.name} · {company.country}</span>
        <h1 className="text-4xl font-bold">Publicar un reto</h1>
        <p className="text-ink-2">Cuéntanos tu problema con tus palabras. La IA lo convierte en un reto acotado, con entrega y rúbrica.</p>
      </div>
      <GenerateForm />
      {drafts.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">Tus borradores</h2>
          {drafts.map((d) => (
            <Link key={d.id} href={`/empresa/nuevo?borrador=${d.id}`} className="card flex items-center justify-between p-4 hover:border-gold">
              <span className="font-semibold">{d.title}</span>
              <span className="chip">Seguir editando</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
