import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-site footer-main">
        <div>
          <Link href="/" className="footer-brand" aria-label="ReCCCreate home"><BrandLogo footer /></Link>
          <p className="footer-claim">From Jaipur temples.<br />Back to the community.</p>
          <p className="footer-note">A student-led circularity project at Dharav High School, Bhankrota, Jaipur, turning temple flowers into rangoli colour and compost.</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-heading">Explore</p>
            <ul className="footer-link-list">
              <li><Link href="/about">Our story</Link></li>
              <li><Link href="/about#process">Our process</Link></li>
              <li><Link href="/shop">The shop</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-heading">Help &amp; policies</p>
            <ul className="footer-link-list"><li><Link href="/privacy">Privacy policy</Link></li><li><Link href="/terms">Terms &amp; conditions</Link></li><li><Link href="/returns">Orders, delivery &amp; returns</Link></li><li><a href="mailto:recccreate@gmail.com">recccreate@gmail.com</a></li></ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-site footer-bottom-inner">
          <p>A student venture from Dharav High School, Bhankrota, Jaipur.</p>
          <p>© {new Date().getFullYear()} ReCCCreate · Credit. Community. Change.</p>
        </div>
      </div>
    </footer>
  );
}
