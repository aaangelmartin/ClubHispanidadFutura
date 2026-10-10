// Ejecutar: node --test src/app/retos/flow.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function load(file, mocks) {
  const source = ts.transpileModule(
    fs.readFileSync(path.join(__dirname, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: (name) => {
      if (!(name in mocks)) throw new Error(name);
      return mocks[name];
    },
    URL,
    Date,
  });
  return exports;
}
const helpers = load("queries.ts", { "server-only": {}, "@/lib/supabase": {} });
const id = "33333333-3333-4333-8333-000000000001";
const open = {
  status: "abierto",
  deadline: new Date(Date.now() + 86400000).toISOString(),
};
test("Solo acepta retos abiertos dentro de plazo", () => {
  assert.equal(helpers.aceptaEntregas(open), true);
  for (const status of ["borrador", "en_valoracion", "cerrado"])
    assert.equal(helpers.aceptaEntregas({ ...open, status }), false);
  assert.equal(
    helpers.aceptaEntregas({
      ...open,
      deadline: new Date(Date.now() - 1000).toISOString(),
    }),
    false,
  );
});
test("Distingue inscripción, entrega, valoración pendiente y valorada", () => {
  const e = { submitted_at: null, evaluations: [] };
  assert.match(helpers.estado(open, e), /Apuntado/);
  e.submitted_at = new Date().toISOString();
  assert.equal(helpers.estado(open, e), "Entregado");
  assert.match(
    helpers.estado({ ...open, status: "en_valoracion" }, e),
    /En valoración/,
  );
  e.evaluations = [{ id: "evaluation" }];
  assert.match(helpers.estado(open, e), /pasaporte/);
});
function setup({
  session = { role: "student", id: "student" },
  reto = open,
  data = [{ id: "submission" }],
} = {}) {
  const calls = [];
  const result = { data, error: null };
  const chain = { then: (resolve) => Promise.resolve(result).then(resolve) };
  for (const method of ["from", "upsert", "update", "eq", "is", "select"])
    chain[method] = (...args) => {
      calls.push([method, ...args]);
      return chain;
    };
  const action = load("actions.ts", {
    "next/navigation": {
      redirect: (url) => {
        throw new Error(`redirect:${url}`);
      },
    },
    "next/cache": { revalidatePath: (p) => calls.push(["revalidate", p]) },
    "@/lib/session": { getSession: async () => session },
    "@/lib/supabase": { db: () => chain },
    "./queries": { ...helpers, detalle: async () => reto },
  });
  return {
    calls,
    run: (values) => action.participar(id, {}, new Map(Object.entries(values))),
  };
}
test("Visitante y empresa deben registrarse como estudiante", async () => {
  for (const session of [null, { role: "company", id: "company" }])
    await assert.rejects(
      setup({ session }).run({ modo: "apuntarse" }),
      /registro\?rol=estudiante/,
    );
});
test("Inscripción repetida no sobrescribe la entrega", async () => {
  const { calls, run } = setup();
  assert.ok((await run({ modo: "apuntarse" })).ok);
  assert.equal(calls.find((c) => c[0] === "upsert")[2].ignoreDuplicates, true);
});
test("Retos cerrados o vencidos no escriben datos", async () => {
  for (const reto of [
    { ...open, status: "cerrado" },
    { ...open, deadline: "2000-01-01" },
  ]) {
    const { calls, run } = setup({ reto });
    assert.ok((await run({ modo: "entregar" })).error);
    assert.equal(calls.length, 0);
  }
});
test("Valida enlace y explicación en servidor", async () => {
  for (const values of [
    { link: "javascript:alert(1)", notes: "solución" },
    { link: "https://example.com", notes: " " },
    { link: "https://user:secret@example.com", notes: "solución" },
  ]) {
    const { calls, run } = setup();
    assert.ok((await run({ modo: "entregar", ...values })).error);
    assert.equal(calls.length, 0);
  }
});
test("Entrega pertenece al estudiante y solo se guarda una vez", async () => {
  const { calls, run } = setup();
  assert.ok(
    (
      await run({
        modo: "entregar",
        link: "https://example.com",
        notes: "Mi solución",
      })
    ).ok,
  );
  assert.ok(
    calls.some(
      (c) => c[0] === "eq" && c[1] === "student_id" && c[2] === "student",
    ),
  );
  assert.ok(
    calls.some(
      (c) => c[0] === "is" && c[1] === "submitted_at" && c[2] === null,
    ),
  );
  assert.ok(calls.find((c) => c[0] === "update")[1].submitted_at);
  assert.equal(calls.filter((c) => c[0] === "revalidate").length, 2);
});
test("No comunica éxito si la inscripción falta o la entrega ya existe", async () => {
  const { run } = setup({ data: [] });
  assert.ok(
    (
      await run({
        modo: "entregar",
        link: "https://example.com",
        notes: "Mi solución",
      })
    ).error,
  );
});
