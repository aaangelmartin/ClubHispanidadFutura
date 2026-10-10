import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Compartido por generate.ts y summarize.ts. No hace falta tocarlo.

export const MODEL = "claude-sonnet-5-5";

function client() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Falta ANTHROPIC_API_KEY en .env.local");
  return new Anthropic();
}

export async function askJson<T>(system: string, user: string): Promise<T> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: 2000,
    system,
    messages: [{ role: "user", content: user }],
  });
  const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("La IA no devolvió JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

