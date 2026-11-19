/* Phool Mitra sign-up: shared field rules plus the browser-side sender.
   The browser posts to our own /api/phool-mitra route, which forwards the row
   to the Google Apps Script, so the script URL and secret never reach visitors. */

export const frequencies = ["Daily", "A few times a week", "Weekly"] as const;

export type PhoolMitraSignup = {
  name: string;
  phone: string;
  area: string;
  temples: string;
  frequency: (typeof frequencies)[number];
};

// Indian mobile number, with or without +91 / 91 / 0 in front.
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, "").replace(/^(\+?91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : null;
}

/* Returns the cleaned sign-up, or an error message for the visitor. */
export function validateSignup(input: Record<string, unknown>): { data: PhoolMitraSignup } | { error: string } {
  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string).trim() : "");
  const name = text("name");
  const area = text("area");
  const temples = text("temples");
  const frequency = text("frequency");
  const phone = normalisePhone(text("phone"));

  if (name.length < 2 || name.length > 100) return { error: "Please enter your full name." };
  if (!phone) return { error: "Please enter a 10-digit Indian mobile number." };
  if (area.length < 2 || area.length > 100) return { error: "Please enter your area or locality in Jaipur." };
  if (temples.length < 2 || temples.length > 300) return { error: "Please tell us which temple(s) near you we could collect from." };
  if (!frequencies.includes(frequency as PhoolMitraSignup["frequency"])) return { error: "Please choose how often you can collect." };
  return { data: { name, phone, area, temples, frequency: frequency as PhoolMitraSignup["frequency"] } };
}

export async function sendSignup(form: HTMLFormElement): Promise<void> {
  const fields = Object.fromEntries(new FormData(form));
  const post = () =>
    fetch("/api/phool-mitra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
      signal: AbortSignal.timeout(45000),
    });
  let res: Response;
  try {
    // A dropped connection (common on mobile data) fails before reaching us, so retry it once.
    res = await post().catch(async (error) => {
      if (!(error instanceof TypeError)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return post();
    });
  } catch (error) {
    if (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new Error("The request timed out. It may have reached the team; check with us on WhatsApp before sending it again.");
    }
    throw new Error("We could not reach the server. Check your internet connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) throw new Error(json?.error || "Your sign-up was not saved. Please try again.");
}
