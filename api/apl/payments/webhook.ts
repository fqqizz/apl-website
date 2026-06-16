import { methodNotAllowed, readJson, sendJson } from "../../_utils/http";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    await readJson(req);
    return sendJson(res, 200, { status: "received" });
  } catch {
    return sendJson(res, 400, { error: "Invalid webhook payload." });
  }
}

