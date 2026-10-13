"use client";

import { useState, type ReactNode } from "react";
import { sendForm, web3formsConfigured } from "@/lib/web3forms";

/* Shared wrapper for the contact and order forms: handles sending,
   the thank-you message and the error message. */
export default function FormShell({
  subject,
  submitLabel,
  thanks,
  children,
}: {
  subject: string;
  submitLabel: string;
  thanks: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      await sendForm(subject, form);
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="card p-8">
        <h3>Thank you</h3>
        <p className="mt-2">{thanks}</p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {!web3formsConfigured && (
        <p className="rounded-xl border-2 border-dashed border-ink/50 px-4 py-2 text-[15px]">
          <strong>Not connected yet.</strong> Add the Web3Forms key to .env.local to make this form send.
        </p>
      )}
      {children}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && (
        <p role="alert" className="rounded-xl border-2 border-error bg-white px-4 py-3 font-extrabold text-error">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary self-start" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
