import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function Admin() {
  return (
    <section className="section">
      <div className="container-site">
        <AdminApp />
      </div>
    </section>
  );
}
