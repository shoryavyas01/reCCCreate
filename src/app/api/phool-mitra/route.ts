import { validateSignup } from "@/lib/phoolMitra";

/* Receives a Phool Mitra sign-up from the site and appends it to the Google Sheet
   through the Apps Script web app. Both values below are server-only env vars. */
// Trimmed, because a value pasted into Vercel can pick up a stray space or line break.
const scriptUrl = process.env.PHOOL_MITRA_SCRIPT_URL?.trim();
const secret = process.env.PHOOL_MITRA_SECRET?.trim();

// Leaves room for three tries at the Google script.
export const maxDuration = 45;

const fail = (error: string, status: number) => Response.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (!scriptUrl || !secret) return fail("Sign-ups are not open yet. Please check back soon.", 503);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Something went wrong with the form. Please reload the page and try again.", 400);
  // Hidden honeypot field: real visitors leave it empty.
  if ((body as Record<string, unknown>).botcheck) return fail("Your sign-up could not be sent. Please reload the page and try again.", 400);

  const result = validateSignup(body as Record<string, unknown>);
  if ("error" in result) return fail(result.error, 400);

  // Google occasionally drops a request or answers with an error page, so try up to three times.
  // The script refusing the secret is a setup problem, not a blip, so that is not retried.
  for (let attempt = 1; attempt <= 3; attempt++) {
    const outcome = await appendRow({ ...result.data, secret }, attempt);
    if (outcome === "saved") return Response.json({ ok: true });
    // The script did not accept the secret: say so, with its length (never the value), to help fix the setting.
    if (outcome === "refused") {
      console.error(`Phool Mitra sheet refused the secret (length ${secret.length})`);
      return Response.json({ ok: false, error: "Your sign-up was not saved. Please try again in a few minutes.", setup: `secret refused, length ${secret.length}` }, { status: 502 });
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
  }
  return fail("Your sign-up was not saved. Please try again in a few minutes.", 502);
}

async function appendRow(row: Record<string, string>, attempt: number): Promise<"saved" | "refused" | "failed"> {
  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const res = await fetch(scriptUrl!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(12000),
    });
    const text = await res.text();
    let json: { ok?: boolean; error?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {}
    if (json?.ok) return "saved";
    console.error(`Phool Mitra sheet attempt ${attempt} failed`, res.status, res.headers.get("content-type"), json?.error ?? text.slice(0, 200));
    return json?.error === "unauthorised" ? "refused" : "failed";
  } catch (error) {
    console.error(`Phool Mitra sheet attempt ${attempt} could not reach the script`, error);
    return "failed";
  }
}
