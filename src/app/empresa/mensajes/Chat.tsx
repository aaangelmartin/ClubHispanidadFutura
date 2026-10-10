"use client";
// Dueño: perfil 4. Mensajería con candidatos (maqueta: los mensajes viven en el navegador).
import { useState } from "react";

type Msg = { de: "empresa" | "candidato"; texto: string; hora: string };
type Conv = { id: string; nombre: string; uni: string; pais: string; reto: string; contactado: boolean; mensajes: Msg[] };

const INICIALES = (n: string) =>
  n
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

const RESPUESTAS = [
  "¡Muchas gracias! Me encantaría. ¿Qué días os vienen bien?",
  "Perfecto, os envío mi disponibilidad esta tarde.",
  "Genial, quedo atento/a. Gracias por el feedback.",
];

export default function Chat({ conversaciones, empresa }: { conversaciones: Conv[]; empresa: string }) {
  const [convs, setConvs] = useState(conversaciones);
  const [activa, setActiva] = useState(conversaciones[0]?.id ?? "");
  const [texto, setTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const conv = convs.find((c) => c.id === activa);

  function enviar() {
    if (!texto.trim() || !conv) return;
    const ahora = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    const id = conv.id;
    setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, mensajes: [...c.mensajes, { de: "empresa", texto, hora: ahora }] } : c)));
    setTexto("");
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      const r = RESPUESTAS[Math.floor(Math.random() * RESPUESTAS.length)]!;
      setConvs((cs) => cs.map((c) => (c.id === id ? { ...c, mensajes: [...c.mensajes, { de: "candidato", texto: r, hora: ahora }] } : c)));
    }, 1800);
  }

  return (
    <div className="grid min-h-[560px] overflow-hidden rounded-xl border border-[#e2e2de] bg-white md:grid-cols-[300px_minmax(0,1fr)]">
      <ul className="max-h-[260px] overflow-y-auto border-b border-[#e2e2de] md:max-h-none md:border-b-0 md:border-r">
        {convs.map((c) => {
          const ultimo = c.mensajes[c.mensajes.length - 1];
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActiva(c.id)}
                className={`relative flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-[#f4f2ec] ${
                  c.id === activa ? "bg-[#f4f2ec] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#c8963a]" : ""
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14233d] text-sm font-bold text-white">
                  {INICIALES(c.nombre)}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-bold text-[#14233d]">{c.nombre}</span>
                  <span className="truncate text-xs text-[#5f6166]">{ultimo?.texto}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {conv && (
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e2de] px-4 py-4 sm:px-6">
            <div className="flex min-w-0 flex-col">
              <span className="text-lg font-bold text-[#14233d]">{conv.nombre}</span>
              <span className="text-xs text-[#5f6166]">
                {conv.uni} · {conv.pais} · Reto: {conv.reto}
              </span>
            </div>
            {conv.contactado ? (
              <span className="rounded bg-[#00843d] px-2 py-1 text-xs font-bold text-white">Candidato contactado</span>
            ) : (
              <span className="rounded bg-[#0b4ea2] px-2 py-1 text-xs font-bold text-white">Nueva entrega</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#f7f6f2] px-4 py-5 sm:px-6">
            {conv.mensajes.map((m, i) => (
              <div key={i} className={`flex max-w-[78%] flex-col gap-1 ${m.de === "empresa" ? "self-end items-end" : "self-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    m.de === "empresa" ? "rounded-br-sm bg-[#14233d] text-white" : "rounded-bl-sm bg-white text-[#14233d] ring-1 ring-[#e2e2de]"
                  }`}
                >
                  {m.texto}
                </div>
                <span className="text-[10px] text-[#5f6166]">
                  {m.de === "empresa" ? empresa : conv.nombre.split(" ")[0]} · {m.hora}
                </span>
              </div>
            ))}
            {escribiendo && <span className="animate-pulse text-xs text-[#5f6166]">{conv.nombre.split(" ")[0]} está escribiendo…</span>}
          </div>
          <form
            className="flex gap-2 border-t border-[#e2e2de] p-4"
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
          >
            <input
              id="mensaje-chat"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={`Escribe a ${conv.nombre.split(" ")[0]}…`}
              className="min-w-0 flex-1 rounded-lg bg-[#f4f2ec] px-4 py-2.5 text-sm outline-none ring-1 ring-[#e2e2de] focus:ring-2 focus:ring-[#c8963a]"
            />
            <button type="submit" className="shrink-0 rounded-lg bg-[#c8963a] px-5 text-sm font-bold text-[#14233d] transition hover:brightness-95">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
