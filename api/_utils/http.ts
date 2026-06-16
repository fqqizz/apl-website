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

  const RuntimeBuffer = (globalThis as any).Buffer;
  if (!RuntimeBuffer) return {};

  const chunks: any[] = [];
  for await (const chunk of req) {
    chunks.push(RuntimeBuffer.isBuffer(chunk) ? chunk : RuntimeBuffer.from(chunk));
  }
  const raw = RuntimeBuffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export function env(name: string) {
  const runtimeProcess = (globalThis as any).process;
  return runtimeProcess?.env?.[name]?.trim() || "";
}

export function createTimeout(ms: number) {
  const AbortControllerCtor = (globalThis as any).AbortController;
  if (!AbortControllerCtor) return { signal: undefined, clear: () => {} };

  const controller = new AbortControllerCtor();
  const timeout = (globalThis as any).setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => (globalThis as any).clearTimeout(timeout),
  };
}

export async function serverFetch(input: string, init?: any) {
  const runtimeFetch = (globalThis as any).fetch;
  if (typeof runtimeFetch !== "function") {
    throw new Error("Server fetch is not available in this runtime.");
  }
  return runtimeFetch(input, init);
}
