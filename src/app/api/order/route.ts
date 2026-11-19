import { getProducts } from "@/lib/data";
import { validateOrder } from "@/lib/order";
import { saveToSheet, sheetConfigured } from "@/lib/sheet";
import { readFormRequest, apiFailure } from "@/lib/formRequest";
export const maxDuration = 30;
export async function POST(request: Request) {
  const body = await readFormRequest(request);
  if ("error" in body) return apiFailure(body.error, body.status);
  try {
    const { data: products } = await getProducts();
    const result = validateOrder(body.data, products);
    if ("error" in result) return apiFailure(result.error, 400);
    if (!sheetConfigured) return apiFailure("Order requests are unavailable. Please contact the team by email.", 503);
    const saved = await saveToSheet("order", result.data);
    if (!saved.saved) return apiFailure("We could not confirm receipt. Please contact the team before submitting again.", 502);
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return apiFailure("We could not confirm receipt. Please contact the team before submitting again.", 502); }
}
