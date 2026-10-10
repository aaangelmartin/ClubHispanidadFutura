// Dueño: perfil 4. Mensajes con candidatos. Conversaciones de ejemplo a partir de los candidatos reales.
import { C } from "@/components/embarca";
import e from "@/app/empresa/_lib/empresa.module.css";
import { getCandidates, requireCompany } from "../_lib/queries";
import Chat from "./Chat";

export const dynamic = "force-dynamic";

export default async function Mensajes() {
  const company = await requireCompany();
  const candidatos = await getCandidates(company.id);
  const nombreContacto = company.contact_name.split(" ")[0];

  const conversaciones = candidatos.map((c) => {
    const nombre = c.student.name.split(" ")[0];
    const contactado = !!c.evaluation?.contact_requested;
    return {
      id: c.id,
      nombre: c.student.name,
      uni: c.student.university,
      pais: c.student.country,
      reto: c.challenge.title,
      contactado,
      mensajes: contactado
        ? [
            { de: "empresa" as const, texto: `Hola ${nombre}, soy ${nombreContacto} de ${company.name}. Nos ha gustado mucho tu entrega. ¿Te apetece una llamada de 20 minutos esta semana?`, hora: "10:12" },
            { de: "candidato" as const, texto: "¡Hola! Muchas gracias, me hace mucha ilusión. Tengo libre el jueves por la tarde.", hora: "11:40" },
            { de: "empresa" as const, texto: "Perfecto, te mando invitación para el jueves a las 17:00 (hora de Madrid).", hora: "11:52" },
          ]
        : [{ de: "candidato" as const, texto: `Hola, acabo de entregar mi propuesta para «${c.challenge.title}». ¡Gracias por la oportunidad!`, hora: "09:30" }],
    };
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl" style={{ color: C.marino }}>
          Mensajes
        </h1>
        <p className="max-w-2xl text-[15px]" style={{ color: C.texto2 }}>
          Habla con los candidatos que te interesan sin salir de la plataforma.
        </p>
      </header>
      {conversaciones.length ? (
        <Chat conversaciones={conversaciones} empresa={company.name} />
      ) : (
        <div className={`${e.panel} flex flex-col items-center gap-3 px-6 py-14 text-center`}>
          <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: C.superficie, color: C.azul }} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
          </span>
          <p className="text-lg font-bold" style={{ color: C.marino }}>
            Aún no hay conversaciones
          </p>
          <p className="max-w-sm text-[15px]" style={{ color: C.texto2 }}>
            Cuando contactes con un candidato, la conversación aparecerá aquí.
          </p>
        </div>
      )}
    </main>
  );
}
