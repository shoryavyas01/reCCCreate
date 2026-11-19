import { validateContact, contactProductLabel } from "@/lib/contact";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";

export const maxDuration = 55;
const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("Please send your message from the contact page.", 403);
  if (Number(request.headers.get("content-length")) > 30000) return fail("Your message is too long.", 413);
  const result = validateContact(await request.json().catch(() => null));
  if ("error" in result) return fail(result.error, 400);
  if (!sheetConfigured) return fail("Direct delivery is not connected. Use the email draft below to contact the team.", 503);
  try {
    const saved = await saveToSheet("contact", { ...result.data, topic: result.data.product ? `Buying · ${contactProductLabel(result.data.product)}` : result.data.topic });
    if (!saved.saved) return fail("Your message was not saved. Please retry or use the email draft below.", 502);
    return Response.json({ ok: true });
  } catch {
    return fail("Your message was not saved. Please retry or use the email draft below.", 502);
  }
}
