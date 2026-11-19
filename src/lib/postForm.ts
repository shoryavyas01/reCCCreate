/* A request may reach the team even when its response is lost. Never auto-retry. */
export async function postForm(path: string, form: HTMLFormElement, notSaved: string): Promise<void> {
  try {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(30000) });
    const outcome = await response.json().catch(() => null);
    if (!response.ok || outcome?.ok !== true) throw new Error(outcome?.error || notSaved);
  } catch (error) {
    if (error instanceof Error && error.name !== "TypeError" && error.name !== "TimeoutError" && error.name !== "AbortError") throw error;
    throw new Error("We could not confirm receipt. Your request may have reached the team; please contact us before submitting again.");
  }
}
