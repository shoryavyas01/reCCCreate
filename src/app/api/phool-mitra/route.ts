import { validateSignup } from "@/lib/phoolMitra";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";
import { readFormRequest, apiFailure } from "@/lib/formRequest";
export const maxDuration = 30;
export async function POST(request: Request) {
  const body = await readFormRequest(request);
  if ("error" in body) return apiFailure(body.error, body.status);
  const result = validateSignup(body.data);
  if ("error" in result) return apiFailure(result.error, 400);
  if (!sheetConfigured) return apiFailure("Sign-ups are unavailable. Please contact the team by email.", 503);
  try {
    const saved = await saveToSheet("phool-mitra", result.data);
    if (!saved.saved) return apiFailure("We could not confirm your sign-up. Please contact the team before submitting again.", 502);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return apiFailure("We could not confirm your sign-up. Please contact the team before submitting again.", 502); }
}
