const maxBytes = 30000;
export function apiFailure(error: string, status: number) {
  return Response.json({ ok: false, error }, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}
export async function readFormRequest(request: Request): Promise<{ data: Record<string, unknown> } | { error: string; status: number }> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return { error: "Please submit this form from our website.", status: 403 };
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return { error: "Please use the form on our website.", status: 415 };
  if (Number(request.headers.get("content-length")) > maxBytes) return { error: "Your submission is too large.", status: 413 };
  const reader = request.body?.getReader();
  if (!reader) return { error: "Please check your form details.", status: 400 };
  let size = 0;
  let text = "";
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return { error: "Your submission is too large.", status: 413 }; }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) return { error: "Please check your form details.", status: 400 };
    if (data.botcheck) return { error: "Your submission could not be accepted.", status: 400 };
    return { data };
  } catch { return { error: "Please reload the page and check your form details.", status: 400 }; }
}
export function hasFormConsent(value: unknown) { return value === true || value === "on"; }
