// Dueño: perfil 4. Mensajes con candidatos. Conversaciones de ejemplo a partir de los candidatos reales.
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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">{company.name}</span>
        <h1 className="text-4xl">Mensajes</h1>
        <p className="max-w-2xl text-[#4f5d73]">Habla con los candidatos que te interesan sin salir de la plataforma.</p>
      </div>
      {conversaciones.length ? (
        <Chat conversaciones={conversaciones} empresa={company.name} />
      ) : (
        <p className="rounded-2xl bg-white/80 p-10 text-center ring-1 ring-black/10">Cuando contactes con un candidato, la conversación aparecerá aquí.</p>
      )}
    </main>
  );
}
