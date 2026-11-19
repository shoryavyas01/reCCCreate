/* Server-only: appends a row to the ReCCCreate Google Sheet through the Apps Script web app.
   One script and one secret serve every form; `form` picks the tab it lands in. */

// Trimmed, because a value pasted into Vercel can pick up a stray space or line break.
const scriptUrl = process.env.PHOOL_MITRA_SCRIPT_URL?.trim();
const secret = process.env.PHOOL_MITRA_SECRET?.trim();

export const sheetConfigured = Boolean(scriptUrl && secret);

export type SheetForm = "phool-mitra" | "contact";
export type SaveResult = { saved: true } | { saved: false; setup?: string };

type ScriptReply = { ok?: boolean; error?: string; version?: number };

async function callScript(init: RequestInit): Promise<{ status: number; type: string | null; json: ScriptReply | null; text: string }> {
  // Apps Script answers with a redirect to the result; fetch follows it.
  const res = await fetch(scriptUrl!, { ...init, signal: AbortSignal.timeout(12000) });
  const text = await res.text();
  let json: ScriptReply | null = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, type: res.headers.get("content-type"), json, text };
}

/* Older copies of the script know only Phool Mitra sign-ups and would put any other form
   in the Sign-ups tab, so check the script is version 2 or later before sending one. */
let scriptVersion: number | null = null;
async function scriptSupportsForms(): Promise<boolean> {
  if (scriptVersion !== null && scriptVersion >= 2) return true;
  try {
    const { json } = await callScript({ method: "GET" });
    scriptVersion = typeof json?.version === "number" ? json.version : 0;
  } catch {
    return false;
  }
  return scriptVersion >= 2;
}

export async function saveToSheet(form: SheetForm, row: Record<string, string>): Promise<SaveResult> {
  if (!scriptUrl || !secret) return { saved: false, setup: "sheet not configured" };
  if (form !== "phool-mitra" && !(await scriptSupportsForms())) {
    console.error(`Sheet script is out of date: paste the latest google-apps-script/website-forms.gs and deploy a new version before using the ${form} form`);
    return { saved: false, setup: "script out of date" };
  }

  // Google occasionally drops a request or answers with an error page, so try up to three times.
  // The script refusing the secret is a setup problem, not a blip, so that is not retried.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { status, type, json, text } = await callScript({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...row, form, secret }),
      });
      if (json?.ok) return { saved: true };
      if (json?.error === "unauthorised") {
        // Report the length (never the value) to help fix the Vercel setting.
        console.error(`Sheet script refused the secret (length ${secret.length})`);
        return { saved: false, setup: `secret refused, length ${secret.length}` };
      }
      console.error(`Sheet attempt ${attempt} for ${form} failed`, status, type, json?.error ?? text.slice(0, 200));
    } catch (error) {
      console.error(`Sheet attempt ${attempt} for ${form} could not reach the script`, error);
    }
    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 700 * attempt));
  }
  return { saved: false };
}
