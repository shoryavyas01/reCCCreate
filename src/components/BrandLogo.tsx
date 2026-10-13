import Image from "next/image";

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  return <span className={`brand-logo-frame${footer ? " brand-logo-footer" : ""}`}>
    <Image
      src="/brand/recccreate-logo.png"
      alt="ReCCCreate — credit, community, change."
      width={2000}
      height={2000}
      priority={!footer}
      sizes={footer ? "300px" : "(max-width: 767px) 180px, 220px"}
      className="brand-logo-image"
    />
  </span>;
}
