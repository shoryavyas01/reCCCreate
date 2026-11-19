import { validateContact, contactProductLabel } from "@/lib/contact";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";
import { readFormRequest, apiFailure } from "@/lib/formRequest";
export const maxDuration = 30;
export async function POST(request: Request) {
  const body = await readFormRequest(request);
  if ("error" in body) return apiFailure(body.error, body.status);
  const result = validateContact(body.data);
  if ("error" in result) return apiFailure(result.error, 400);
  if (!sheetConfigured) return apiFailure("Direct delivery is not connected. Use the email draft below to contact the team.", 503);
  try {
    const saved = await saveToSheet("contact", { ...result.data, topic: result.data.product ? `Buying · ${contactProductLabel(result.data.product)}` : result.data.topic });
    if (!saved.saved) return apiFailure("We could not confirm receipt. Contact the team by email before submitting again.", 502);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return apiFailure("We could not confirm receipt. Contact the team by email before submitting again.", 502); }
}
