"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <html lang="en"><body style={{ margin: 0, padding: "10vh 8vw", background: "#f6f1e7", color: "#263b2d", fontFamily: "Georgia, serif", minHeight: "100vh", boxSizing: "border-box" }}><title>Something went wrong | ReCCCreate</title><p style={{ fontFamily: "system-ui", fontSize: 12, letterSpacing: 2 }}>RECCCREATE / A PAUSE IN THE JOURNEY</p><h1 style={{ maxWidth: 600, fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 400 }}>We couldn’t open this page.</h1><p style={{ fontFamily: "system-ui", lineHeight: 1.8 }}>Please try again, or return to the homepage.</p><button onClick={retry} style={{ background: "#304b35", color: "#fffaf0", border: 0, padding: "16px 24px", cursor: "pointer", marginRight: 24 }}>Try again</button><a href="/" style={{ color: "#263b2d" }}>Back to home</a></body></html>;
}
