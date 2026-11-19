import { validateSignup } from "@/lib/phoolMitra";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";

/* Receives a Phool Mitra sign-up from the site and appends it to the Sign-ups tab of the Google Sheet. */

// Leaves room for three tries at the Google script.
export const maxDuration = 45;

const fail = (error: string, status: number, setup?: string) => Response.json({ ok: false, error, setup }, { status });

export async function POST(request: Request) {
  if (!sheetConfigured) return fail("Sign-ups are not open yet. Please check back soon.", 503);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Something went wrong with the form. Please reload the page and try again.", 400);
  // Hidden honeypot field: real visitors leave it empty.
  if ((body as Record<string, unknown>).botcheck) return fail("Your sign-up could not be sent. Please reload the page and try again.", 400);

  const result = validateSignup(body as Record<string, unknown>);
  if ("error" in result) return fail(result.error, 400);

  const saved = await saveToSheet("phool-mitra", result.data);
  if (saved.saved) return Response.json({ ok: true });
  return fail("Your sign-up was not saved. Please try again in a few minutes.", 502, saved.setup);
}
