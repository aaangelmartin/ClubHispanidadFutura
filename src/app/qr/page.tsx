// Dueño: perfil 1. /qr: pantalla para proyectar con el código QR de la web desplegada.
import type { Metadata } from "next";
import QRCode from "qrcode";
import { Isotipo } from "@/components/embarca";

export const metadata: Metadata = { title: "Escanea · Embarca" };

const URL_WEB = "https://club-hispanidad-futura.vercel.app";
const URL_VISIBLE = "club-hispanidad-futura.vercel.app";

export default async function Qr() {
  const svg = await QRCode.toString(URL_WEB, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0b4ea2", light: "#ffffff" },
  });

  return (
    <main className="flex min-h-[calc(100svh-58px)] items-center bg-ink px-5 py-12 text-white sm:px-8">
      <div className="mx-auto grid w-full max-w-[1312px] items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20 lg:px-8">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-3">
            <Isotipo size={40} />
            <span className="text-3xl font-bold tracking-[-0.03em]">Embarca</span>
          </span>
          <h1 className="text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[64px] lg:text-[80px]">
            Próximo destino: tu primer trabajo.
          </h1>
          <p className="max-w-[34ch] text-xl leading-relaxed text-[#c9cfda]">
            Escanea el código y saca tu pasaporte en un minuto. Gratis para estudiantes.
          </p>
          <a
            href={URL_WEB}
            className="w-fit rounded-md bg-white/10 px-4 py-3 font-mono text-lg text-gold ring-1 ring-white/20 hover:bg-white/15 sm:text-2xl"
          >
            {URL_VISIBLE}
          </a>
        </div>
        <div className="mx-auto w-full max-w-[420px] rounded-3xl bg-gold p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="rounded-2xl bg-white p-5">
            <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          <p className="px-2 pb-1 pt-3 text-center text-base font-bold text-ink">Escanea para entrar</p>
        </div>
      </div>
    </main>
  );
}
