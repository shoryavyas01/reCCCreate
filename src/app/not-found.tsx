import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-site max-w-2xl">
        <h1>Page not found</h1>
        <p className="mt-5">
          We could not find that page. If you scanned a QR code on a pack, the batch may not be recorded yet.
        </p>
        <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
      </div>
    </section>
  );
}
