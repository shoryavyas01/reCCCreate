export default function Loading() {
  return <section className="section" role="status" aria-live="polite" aria-busy="true"><div className="container-site">
    <p className="eyebrow mb-6">Loading your next chapter</p>
    <div className="skeleton h-20 max-w-xl" aria-hidden="true" />
    <div className="skeleton mt-5 h-5 max-w-md" aria-hidden="true" />
    <div className="skeleton mt-10 h-72" aria-hidden="true" />
    <span className="sr-only">Please wait while the page loads.</span>
  </div></section>;
}
