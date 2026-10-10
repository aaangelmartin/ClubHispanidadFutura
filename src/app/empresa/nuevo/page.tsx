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
        <div className="flex flex-col items-start gap-4 rounded-xl bg-white p-6 ring-1 ring-[#e2e2de] sm:p-8">
          <span className="rounded bg-[#00843d] px-2 py-1 text-xs font-bold text-white">Embarcando</span>
          <h1 className="text-3xl font-bold text-[#14233d] sm:text-4xl">Reto publicado</h1>
          <p className="text-[15px] text-[#5f6166]">Ya lo pueden ver los estudiantes de España y LatAm. Recibirás las entregas en tu panel.</p>
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
            <span className="text-sm font-semibold text-[#5f6166]">{company.name} · borrador</span>
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#14233d] sm:text-4xl">Revisa tu tarjeta de embarque</h1>
            <p className="text-[15px] text-[#5f6166]">La IA ha preparado esta propuesta. Cámbiala como quieras y publícala cuando esté lista.</p>
          </div>
          <EditForm challenge={draft} saved={guardado === "1"} />
          <form action={deleteDraft}>
            <input type="hidden" name="id" value={draft.id} />
            <button type="submit" className="text-sm text-[#5f6166] underline">Descartar este borrador</button>
          </form>
        </main>
      );
    }
  }

  const drafts = await getDrafts(company.id);
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[#5f6166]">{company.name} · {company.country}</span>
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#14233d] sm:text-4xl">Publicar un reto con IA</h1>
        <p className="text-[15px] text-[#5f6166]">Cuéntanos tu problema con tus palabras. La IA lo convierte en un reto acotado, con entrega y rúbrica.</p>
      </div>
      <GenerateForm />
      {drafts.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-[#14233d]">Tus borradores</h2>
          {drafts.map((d) => (
            <Link key={d.id} href={`/empresa/nuevo?borrador=${d.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-[#e2e2de] hover:ring-[#c8963a]">
              <span className="min-w-0 font-semibold text-[#14233d]">{d.title}</span>
              <span className="shrink-0 rounded bg-[#f4f2ec] px-2 py-1 text-xs font-bold text-[#14233d]">Borrador</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
