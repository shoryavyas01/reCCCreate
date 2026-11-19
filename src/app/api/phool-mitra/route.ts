import { validateSignup } from "@/lib/phoolMitra";

/* Receives a Phool Mitra sign-up from the site and appends it to the Google Sheet
   through the Apps Script web app. Both values below are server-only env vars. */
const scriptUrl = process.env.PHOOL_MITRA_SCRIPT_URL;
const secret = process.env.PHOOL_MITRA_SECRET;

const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (!scriptUrl || !secret) return fail("Sign-ups are not open yet. Please check back soon.", 503);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Something went wrong with the form. Please reload the page and try again.", 400);
  // Hidden honeypot field: real visitors leave it empty.
  if ((body as Record<string, unknown>).botcheck) return fail("Your sign-up could not be sent. Please reload the page and try again.", 400);

  const result = validateSignup(body as Record<string, unknown>);
  if ("error" in result) return fail(result.error, 400);

  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...result.data, secret }),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json().catch(() => null);
    if (!json?.ok) {
      console.error("Phool Mitra sheet rejected the sign-up", res.status, json?.error);
      return fail("Your sign-up was not saved. Please try again in a few minutes.", 502);
    }
  } catch (error) {
    console.error("Phool Mitra sheet could not be reached", error);
    return fail("Your sign-up was not saved. Please try again in a few minutes.", 502);
  }
  return Response.json({ ok: true });
}
