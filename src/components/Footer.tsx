import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green text-white">
      <div className="container-site flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-extrabold tracking-[0.04em]">ReCCCreate</p>
          <p className="text-[15px]">CCC stands for Credit. Community. Change.</p>
        </div>
        <p className="text-[15px]">
          A student venture from Dharav High School, Bhankrota, Jaipur.{" "}
          <Link href="/contact" className="underline underline-offset-4">
            Get in touch
          </Link>
        </p>
      </div>
    </footer>
  );
}
