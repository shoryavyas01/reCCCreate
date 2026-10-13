import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1b3027] text-white">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
        <div>
          <Link href="/" className="text-xl font-bold tracking-[-0.055em] text-white no-underline">ReCCCreate</Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/65">Giving temple-offered flowers a thoughtful second life through a student-led project in Jaipur.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Explore</p><ul className="mt-4 space-y-2.5 text-sm text-white/80"><li><Link href="/about" className="transition-colors hover:text-white">Our story</Link></li><li><Link href="/shop" className="transition-colors hover:text-white">Shop</Link></li><li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li></ul></div>
          <div className="col-span-2 sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Our belief</p><p className="mt-4 max-w-[16rem] text-sm leading-7 text-white/80">Credit. Community. Change.<br />A cycle that gives more back.</p></div>
        </div>
      </div>
      <div className="border-t border-white/10"><div className="container-site flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>A student venture from Dharav High School, Bhankrota, Jaipur.</p><p>Made with care, petal by petal.</p></div></div>
    </footer>
  );
}
