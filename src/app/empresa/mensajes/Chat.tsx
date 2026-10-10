"use client";
// Dueño: perfil 4. Mensajería con candidatos (maqueta: los mensajes viven en el navegador).
import { useState } from "react";

type Msg = { de: "empresa" | "candidato"; texto: string; hora: string };
type Conv = { id: string; nombre: string; uni: string; pais: string; reto: string; mensajes: Msg[] };

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
    <div className="grid min-h-[560px] overflow-hidden rounded-2xl bg-white/80 shadow-xl ring-1 ring-black/10 md:grid-cols-[300px_1fr]">
      <ul className="border-b border-black/5 md:border-b-0 md:border-r">
        {convs.map((c) => {
          const ultimo = c.mensajes[c.mensajes.length - 1];
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActiva(c.id)}
                className={`flex w-full gap-3 px-4 py-4 text-left hover:bg-[#eef1ee] ${c.id === activa ? "bg-[#eef1ee]" : ""}`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#14233d] text-sm font-bold text-[#f3efe6]">
                  {INICIALES(c.nombre)}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-bold">{c.nombre}</span>
                  <span className="truncate text-xs text-[#4f5d73]">{ultimo?.texto}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {conv && (
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 px-6 py-4">
            <div className="flex flex-col">
              <span className="text-lg font-extrabold">{conv.nombre}</span>
              <span className="text-xs text-[#4f5d73]">
                {conv.uni} · {conv.pais} · Reto: {conv.reto}
              </span>
            </div>
            <span className="rounded-full bg-[#2f7a55]/10 px-3 py-1 text-xs font-semibold text-[#2f7a55]">Candidato contactado</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5">
            {conv.mensajes.map((m, i) => (
              <div key={i} className={`flex max-w-[78%] flex-col gap-1 ${m.de === "empresa" ? "self-end items-end" : "self-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    m.de === "empresa" ? "rounded-br-sm bg-[#14233d] text-[#f3efe6]" : "rounded-bl-sm bg-[#eef1ee]"
                  }`}
                >
                  {m.texto}
                </div>
                <span className="text-[10px] text-[#4f5d73]">
                  {m.de === "empresa" ? empresa : conv.nombre.split(" ")[0]} · {m.hora}
                </span>
              </div>
            ))}
            {escribiendo && <span className="animate-pulse text-xs text-[#4f5d73]">{conv.nombre.split(" ")[0]} está escribiendo…</span>}
          </div>
          <form
            className="flex gap-2 border-t border-black/5 p-4"
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
              className="flex-1 rounded-full bg-[#eef1ee] px-4 py-2.5 text-sm outline-none ring-1 ring-black/5 focus:ring-[#c8963a]"
            />
            <button type="submit" className="rounded-full bg-[#c8963a] px-5 text-sm font-bold text-[#14233d]">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
