/* Sends a form to Web3Forms, which emails it to the address the access key was created with. */
export const web3formsConfigured = Boolean(process.env.NEXT_PUBLIC_WEB3FORMS_KEY);

export async function sendForm(subject: string, form: HTMLFormElement): Promise<void> {
  const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!key) throw new Error("The form is not set up yet. Please try again later.");

  const data = new FormData(form);
  // Hidden honeypot field: real visitors leave it empty.
  if (data.get("botcheck")) return;
  data.append("access_key", key);
  data.append("subject", subject);
  data.append("from_name", "ReCCCreate website");

  let res: Response;
  try {
    res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
  } catch {
    throw new Error("We could not reach the server. Check your internet connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Something went wrong and your message was not sent. Please try again.");
  }
}
