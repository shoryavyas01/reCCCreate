import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-site footer-main">
        <div>
          <Link href="/" className="footer-brand">ReCCCreate</Link>
          <p className="footer-claim">Let what blooms, bloom again.</p>
          <p className="footer-note">A student-led circularity project in Bhankrota, Jaipur, giving temple-offered flowers a thoughtful next chapter through natural gulaal and compost.</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-heading">Explore</p>
            <ul className="footer-link-list">
              <li><Link href="/about">Our story</Link></li>
              <li><Link href="/shop">The shop</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/trace/sample">Sample batch trace</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Our belief</p>
            <p className="footer-link-list">Credit. Community. Change.<br />A cycle that gives more back.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-site footer-bottom-inner">
          <p>A student venture from Dharav High School, Bhankrota, Jaipur.</p>
          <p>Made with care, petal by petal.</p>
        </div>
      </div>
    </footer>
  );
}
