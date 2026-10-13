"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import ResourceManager, { type Field, type Option } from "./ResourceManager";

type Tab = "temples" | "collections" | "batches" | "products";
const tabs: { id: Tab; label: string }[] = [
  { id: "temples", label: "Temples" },
  { id: "collections", label: "Collections" },
  { id: "batches", label: "Batches" },
  { id: "products", label: "Products" },
];

export default function AdminApp() {
  const db = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("temples");
  const [temples, setTemples] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);

  useEffect(() => {
    if (!db) return;
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [db]);

  // Only accounts listed in the `admins` table may stay signed in.
  const userId = session?.user.id;
  useEffect(() => {
    if (!db || !userId) return;
    let cancelled = false;
    db.from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(async ({ data }) => {
        if (cancelled) return;
        if (data) return setIsAdmin(true);
        await db.auth.signOut();
        setIsAdmin(null);
        setError("This account is not an admin.");
      });
    return () => {
      cancelled = true;
    };
  }, [db, userId]);

  // Temple and product names for the dropdowns in the Collections and Batches forms.
  useEffect(() => {
    if (!db || !isAdmin) return;
    db.from("temples").select("id, name").order("name").then(({ data }) =>
      setTemples((data ?? []).map((t) => ({ value: t.id, label: t.name }))),
    );
    db.from("products").select("id, name, size").order("name").then(({ data }) =>
      setProducts((data ?? []).map((p) => ({ value: p.id, label: `${p.name} (${p.size})` }))),
    );
  }, [db, isAdmin, tab]);

  if (!db) {
    return (
      <div className="card max-w-xl">
        <h1>Admin</h1>
        <p className="mt-4">
          Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the site. The README has the steps.
        </p>
      </div>
    );
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await db!.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) setError("Wrong email or password.");
    setBusy(false);
  }

  if (!session || !isAdmin) {
    return (
      <form onSubmit={signIn} className="card flex max-w-md flex-col gap-5 p-8">
        <h1>Admin</h1>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="field bg-white" id="email" name="email" type="email" required autoComplete="username" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input className="field bg-white" id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {error && <p role="alert" className="font-extrabold text-error">{error}</p>}
        <button className="btn btn-primary" disabled={busy || Boolean(session)}>
          {busy || session ? "Signing in…" : "Sign in"}
        </button>
      </form>
    );
  }

  const fields: Record<Tab, Field[]> = {
    temples: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "area", label: "Area", type: "text", required: true },
      { key: "photo_url", label: "Photo", type: "photo" },
      { key: "collecting_since", label: "Collecting since", type: "date" },
      { key: "is_visible", label: "Shown on the site (only after the temple agrees)", short: "Shown", type: "checkbox" },
    ],
    collections: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "temple_id", label: "Temple", type: "select", options: temples, required: true },
      { key: "kg", label: "Kg collected", short: "Kg", type: "number", required: true },
    ],
    batches: [
      { key: "product_id", label: "Product", type: "select", options: products, required: true },
      { key: "temple_id", label: "Temple", type: "select", options: temples, required: true },
      { key: "collected_on", label: "Flowers collected on", short: "Collected", type: "date", required: true },
      { key: "kg_flowers_used", label: "Kg of flowers used", short: "Kg used", type: "number", required: true },
      { key: "kg_produced", label: "Kg of product made", short: "Kg made", type: "number" },
      { key: "made_by", label: "Made by (names)", short: "Made by", type: "text" },
    ],
    products: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "type", label: "Type", type: "select", required: true, options: [{ value: "gulaal", label: "Gulaal" }, { value: "compost", label: "Compost" }] },
      { key: "price_inr", label: "Price (₹)", type: "number", required: true },
      { key: "size", label: "Size", type: "text", required: true },
      { key: "photo_url", label: "Photo", type: "photo" },
      { key: "ingredients", label: "Ingredients", type: "text" },
      { key: "in_stock", label: "In stock", type: "checkbox", defaultValue: true },
    ],
  };
  const orderBy: Record<Tab, string> = { temples: "name", collections: "date", batches: "collected_on", products: "name" };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1>Admin</h1>
        <button className="btn btn-secondary" onClick={() => db.auth.signOut().then(() => setIsAdmin(null))}>
          Sign out
        </button>
      </div>
      <p className="mt-2 text-[15px]">Signed in as {session.user.email}. Changes appear on the site within a minute.</p>

      <div role="tablist" aria-label="Data" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-5 py-2 font-extrabold uppercase tracking-[0.08em] text-[15px] ${
              tab === t.id ? "bg-green text-white" : "bg-green-light text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ResourceManager key={tab} db={db} table={tab} fields={fields[tab]} orderBy={orderBy[tab]} showQr={tab === "batches"} />
    </div>
  );
}
