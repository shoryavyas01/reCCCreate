"use client";

import { useRef, useState, type ReactNode } from "react";
import { sendForm, web3formsConfigured } from "@/lib/web3forms";

export default function FormShell({ subject, submitLabel, thanks, children, disabledReason, onSent }: { subject: string; submitLabel: string; thanks: string; children: ReactNode; disabledReason?: string; onSent?: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const inFlight = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);
  const unavailable = disabledReason || (!web3formsConfigured ? "Messages are temporarily unavailable. Please check back once the team opens enquiries." : undefined);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current || unavailable) return;
    const form = e.currentTarget;
    inFlight.current = true;
    setStatus("sending");
    setError("");
    try {
      await sendForm(subject, form);
      form.reset();
      onSent?.();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message was not sent. Please try again.");
      setStatus("idle");
    } finally {
      inFlight.current = false;
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }
  if (status === "sent") return <div ref={feedback} role="status" tabIndex={-1} className="card p-8"><p className="eyebrow mb-4">Received with thanks</p><h3 className="font-display text-3xl font-normal">Your next chapter starts here.</h3><p className="mt-4 text-sm leading-7">{thanks}</p><button type="button" className="btn btn-secondary mt-6" onClick={() => setStatus("idle")}>Send another</button></div>;
  return <form onSubmit={onSubmit} className="flex flex-col gap-5" aria-busy={status === "sending"}>
    {unavailable && <p role="status" className="sample-notice">{unavailable}</p>}
    <fieldset disabled={status === "sending" || Boolean(unavailable)} className="flex min-w-0 flex-col gap-5 border-0 p-0">{children}</fieldset>
    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    {error && <div ref={feedback} tabIndex={-1} role="alert" className="border border-error bg-[#fff6ee] px-4 py-3 text-sm text-error"><strong>Message not sent.</strong><p className="mt-1">{error} Your details have been kept so you can retry.</p></div>}
    <button type="submit" className="btn btn-primary self-start" disabled={status === "sending" || Boolean(unavailable)}>{status === "sending" ? "Sending…" : submitLabel}<span aria-hidden="true">↗</span></button>
    <p className="text-xs leading-6 text-[#646c59]">We use these details to respond to your enquiry. Please avoid including sensitive personal information.</p>
  </form>;
}
