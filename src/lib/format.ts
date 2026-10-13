export function formatDate(iso: string | null | undefined, withDay = true) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: withDay ? "numeric" : undefined,
    month: "long",
    year: "numeric",
  });
}

export function formatKg(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: n < 100 ? 1 : 0 });
}
