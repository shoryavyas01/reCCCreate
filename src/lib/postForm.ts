/* Browser-side: posts a form's fields as JSON to one of the site's own API routes. */
export async function postForm(path: string, form: HTMLFormElement, notSaved: string): Promise<void> {
  const fields = Object.fromEntries(new FormData(form));
  const post = () =>
    fetch(path, {
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
      throw new Error("The request timed out. It may have reached the team; check with us before sending it again.");
    }
    throw new Error("We could not reach the server. Check your internet connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) throw new Error(json?.error || notSaved);
}
