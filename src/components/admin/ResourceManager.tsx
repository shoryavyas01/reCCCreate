"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

export type Option = { value: string; label: string };
export type Field = {
  key: string;
  label: string;
  short?: string; // shorter label for the table header
  type: "text" | "number" | "date" | "checkbox" | "select" | "photo";
  options?: Option[];
  required?: boolean;
  defaultValue?: boolean;
};
type Row = Record<string, string | number | boolean | null>;

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");

/* One add / edit / delete screen, reused for every table.
   Supabase row-level security rejects any write that does not come from an admin. */
export default function ResourceManager({
  db,
  table,
  fields,
  orderBy,
  showQr = false,
}: {
  db: SupabaseClient;
  table: string;
  fields: Field[];
  orderBy: string;
  showQr?: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from(table).select("*").order(orderBy, { ascending: false }).limit(500);
    if (error) setMessage({ ok: false, text: `Could not load: ${error.message}` });
    else setRows(data ?? []);
  }, [db, table, orderBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load from Supabase
    load();
  }, [load]);

  function resetForm(row: Row | null) {
    setEditing(row);
    setFormKey((k) => k + 1);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setMessage(null);
    try {
      const values: Row = {};
      for (const f of fields) {
        const raw = form.get(f.key);
        if (f.type === "checkbox") values[f.key] = raw === "on";
        else if (f.type === "number") values[f.key] = raw === "" || raw === null ? null : Number(raw);
        else if (f.type === "photo") {
          const file = form.get(`${f.key}_file`);
          if (file instanceof File && file.size > 0) {
            const path = `${table}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;
            const { error } = await db.storage.from("photos").upload(path, file);
            if (error) throw new Error(`Photo upload failed: ${error.message}`);
            values[f.key] = db.storage.from("photos").getPublicUrl(path).data.publicUrl;
          } else values[f.key] = String(raw ?? "").trim() || null;
        } else values[f.key] = String(raw ?? "").trim() || null;
      }
      const { error } = editing
        ? await db.from(table).update(values).eq("id", editing.id)
        : await db.from(table).insert(values);
      if (error) throw new Error(error.message);
      setMessage({ ok: true, text: editing ? "Saved." : "Added." });
      resetForm(null);
      await load();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Could not save." });
    }
    setBusy(false);
  }

  async function remove(row: Row) {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    const { error } = await db.from(table).delete().eq("id", row.id);
    if (error) setMessage({ ok: false, text: `Could not delete: ${error.message}` });
    else {
      setMessage({ ok: true, text: "Deleted." });
      if (editing?.id === row.id) resetForm(null);
      await load();
    }
  }

  async function downloadQr(id: string) {
    const url = await QRCode.toDataURL(`${siteUrl()}/trace/${id}`, { width: 600, margin: 2 });
    const a = document.createElement("a");
    a.href = url;
    a.download = `recccreate-batch-${id}.png`;
    a.click();
  }

  const show = (f: Field, row: Row) => {
    const v = row[f.key];
    if (f.type === "checkbox") return v ? "Yes" : "No";
    if (f.type === "select") return f.options?.find((o) => o.value === v)?.label ?? "";
    if (f.type === "photo") return v ? "Yes" : "None";
    return v ?? "";
  };

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.6fr]">
      <form key={formKey} onSubmit={save} className="card flex flex-col gap-4 self-start">
        <h2 className="text-[22px]">{editing ? "Edit entry" : "Add new"}</h2>
        {fields.map((f) => {
          const id = `${table}-${f.key}`;
          const value = editing?.[f.key];
          if (f.type === "checkbox")
            return (
              <label key={f.key} className="flex items-center gap-3 font-extrabold">
                <input type="checkbox" name={f.key} className="size-5 accent-green" defaultChecked={editing ? Boolean(value) : f.defaultValue} />
                {f.label}
              </label>
            );
          return (
            <div key={f.key}>
              <label className="label" htmlFor={id}>{f.label}</label>
              {f.type === "select" ? (
                <select className="field bg-white" id={id} name={f.key} required={f.required} defaultValue={String(value ?? "")}>
                  <option value="" disabled>Choose one</option>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === "photo" ? (
                <>
                  <input className="field bg-white" id={id} name={`${f.key}_file`} type="file" accept="image/*" />
                  <input className="field mt-2 bg-white" name={f.key} type="url" placeholder="or paste an image link" aria-label={`${f.label} link`} defaultValue={String(value ?? "")} />
                </>
              ) : (
                <input
                  className="field bg-white"
                  id={id}
                  name={f.key}
                  type={f.type}
                  step={f.type === "number" ? "any" : undefined}
                  min={f.type === "number" ? 0 : undefined}
                  required={f.required}
                  defaultValue={String(value ?? "")}
                />
              )}
            </div>
          );
        })}
        {message && (
          <p role={message.ok ? "status" : "alert"} className={`font-extrabold ${message.ok ? "text-green" : "text-error"}`}>
            {message.text}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Add"}</button>
          {editing && <button type="button" className="btn btn-secondary" onClick={() => resetForm(null)}>Cancel</button>}
        </div>
      </form>

      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <p>Nothing here yet.</p>
        ) : (
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b-2 border-green">
                {showQr && <th className="p-2">Batch</th>}
                {fields.map((f) => <th key={f.key} className="p-2">{f.short ?? f.label}</th>)}
                <th className="p-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-b border-green/25 align-top">
                  {showQr && (
                    <td className="p-2">
                      <a className="underline" href={`/trace/${row.id}`} target="_blank" rel="noreferrer">{row.id}</a>
                    </td>
                  )}
                  {fields.map((f) => <td key={f.key} className="p-2">{show(f, row)}</td>)}
                  <td className="whitespace-nowrap p-2 text-right">
                    {showQr && <button className="mr-3 font-extrabold underline" onClick={() => downloadQr(String(row.id))}>QR code</button>}
                    <button className="mr-3 font-extrabold underline" onClick={() => resetForm(row)}>Edit</button>
                    <button className="font-extrabold text-error underline" onClick={() => remove(row)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
