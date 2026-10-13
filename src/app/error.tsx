"use client";

import Link from "next/link";
import BotanicalMotif from "@/components/BotanicalMotif";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="section"><div className="container-site state-page">
    <BotanicalMotif className="state-flower" />
    <p className="eyebrow mb-5">A pause in the journey</p>
    <h1>We couldn’t load <span className="display-accent">this page.</span></h1>
    <p className="body-copy mt-6">Check your connection and try again. If the problem continues, please come back a little later.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><button className="btn btn-primary" onClick={retry}>Try again ↻</button><Link className="btn btn-secondary" href="/">Back to home</Link></div>
  </div></section>;
}
