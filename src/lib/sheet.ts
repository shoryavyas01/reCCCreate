/* Server-only: appends a row to the ReCCCreate Google Sheet through the Apps Script web app.
   One script and one secret serve every form; `form` picks the tab it lands in. */

// Trimmed, because a value pasted into Vercel can pick up a stray space or line break.
const scriptUrl = process.env.PHOOL_MITRA_SCRIPT_URL?.trim();
const secret = process.env.PHOOL_MITRA_SECRET?.trim();

export const sheetConfigured = Boolean(scriptUrl && secret);

export type SheetForm = "phool-mitra" | "contact" | "order";

// The oldest script version that knows each form. Older copies of the script put every row in Sign-ups.
const minimumVersion: Record<SheetForm, number> = { "phool-mitra": 1, contact: 2, order: 3 };
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

/* Asks the script which version it is (a GET, which saves nothing) before sending a form
   that older copies of the script do not know. */
let scriptVersion = 0;
async function scriptSupports(form: SheetForm): Promise<boolean> {
  const needed = minimumVersion[form];
  if (needed <= 1 || scriptVersion >= needed) return true;
  try {
    const { json } = await callScript({ method: "GET" });
    scriptVersion = typeof json?.version === "number" ? json.version : 0;
  } catch {
    return false;
  }
  return scriptVersion >= needed;
}

export async function saveToSheet(form: SheetForm, row: Record<string, string>): Promise<SaveResult> {
  if (!scriptUrl || !secret) return { saved: false, setup: "sheet not configured" };
  if (!(await scriptSupports(form))) {
    console.error(`Sheet script is out of date: paste the latest google-apps-script/website-forms.gs and deploy a new version before using the ${form} form`);
    return { saved: false, setup: "script out of date" };
  }

  try {
    const { status, json } = await callScript({
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...row, form, secret }),
    });
    if (status >= 200 && status < 300 && json?.ok === true) return { saved: true };
    console.error(`Sheet submission for ${form} was not confirmed (HTTP ${status})`);
    return { saved: false };
  } catch {
    console.error(`Sheet submission for ${form} could not be confirmed`);
    return { saved: false };
  }
}
