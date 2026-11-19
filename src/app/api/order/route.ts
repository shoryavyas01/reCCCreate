import { getProducts } from "@/lib/data";
import { validateOrder } from "@/lib/order";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";

/* Receives a shop order request and appends it to the Orders tab of the Google Sheet. */

// Leaves room for the script version check and three tries at the Google script.
export const maxDuration = 50;

const fail = (error: string, status: number, setup?: string) => Response.json({ ok: false, error, setup }, { status });

export async function POST(request: Request) {
  if (!sheetConfigured) return fail("Online orders are not open yet. Please contact the team.", 503);

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Something went wrong with the form. Please reload the page and try again.", 400);
  // Hidden honeypot field: real visitors leave it empty.
  if ((body as Record<string, unknown>).botcheck) return fail("Your order could not be sent. Please reload the page and try again.", 400);

  const { data: products } = await getProducts();
  const result = validateOrder(body as Record<string, unknown>, products);
  if ("error" in result) return fail(result.error, 400);

  const saved = await saveToSheet("order", result.data);
  if (saved.saved) return Response.json({ ok: true });
  return fail("Your order request was not sent. Please try again in a few minutes.", 502, saved.setup);
}
