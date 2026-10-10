"use client";
// Dueño: perfil 1. Vuelve a pedir los datos del panel cada 20 s sin recargar la página.
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Refresco({ segundos = 20 }: { segundos?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), segundos * 1000);
    return () => clearInterval(id);
  }, [router, segundos]);
  return null;
}
