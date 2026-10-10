"use client";
// Dueño: perfil 4.
import { useState } from "react";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Enlace copiado" : "Copiar enlace del pasaporte"}
    </button>
  );
}
