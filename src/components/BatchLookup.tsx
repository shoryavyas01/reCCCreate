"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BatchLookup() {
  const router = useRouter();
  const [error, setError] = useState("");
  return <form className="batch-lookup" onSubmit={(event) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("batch") ?? "").trim();
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(value)) {
      setError("Enter the batch ID printed on your pack, using letters, numbers or hyphens.");
      return;
    }
    setError("");
    router.push(`/trace/${encodeURIComponent(value)}`);
  }}>
    <label className="label" htmlFor="batch-lookup">Batch ID on your pack</label>
    <div className="flex flex-col gap-3 sm:flex-row">
      <input id="batch-lookup" name="batch" className="field" placeholder="e.g. sample" required maxLength={80} aria-invalid={Boolean(error)} aria-describedby={error ? "batch-error" : undefined} onChange={() => setError("")} />
      <button type="submit" className="btn btn-primary shrink-0">Trace my pack <span aria-hidden="true">↗</span></button>
    </div>
    {error && <p id="batch-error" role="alert" className="mt-3 text-sm text-error">{error}</p>}
  </form>;
}
