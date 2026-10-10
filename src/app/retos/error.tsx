"use client";
export default function ErrorRetos({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="card p-6">
        <h1 className="text-3xl font-bold">No pudimos cargar los retos</h1>
        <p className="mt-3 text-ink-2">
          Vuelve a intentarlo en unos instantes.
        </p>
        <button className="btn btn-primary mt-5" onClick={reset}>
          Reintentar
        </button>
      </div>
    </main>
  );
}
