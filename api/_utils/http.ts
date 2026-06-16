import { Buffer } from "node:buffer";
import { clearTimeout, setTimeout } from "node:timers";

export function sendJson(res: any, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.json(body);
}

export function methodNotAllowed(res: any, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  return sendJson(res, 405, { error: "Method not allowed." });
}

export async function readJson(req: any) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) return JSON.parse(req.body);

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export function env(name: string) {
  return process.env[name]?.trim() || "";
}

export function createTimeout(ms: number) {
  const AbortControllerCtor = (globalThis as any).AbortController;
  if (!AbortControllerCtor) return { signal: undefined, clear: () => {} };

  const controller = new AbortControllerCtor();
  const timeout = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

export async function serverFetch(input: string, init?: any) {
  const runtimeFetch = (globalThis as any).fetch;
  if (typeof runtimeFetch !== "function") {
    throw new Error("Server fetch is not available in this runtime.");
  }
  return runtimeFetch(input, init);
}
