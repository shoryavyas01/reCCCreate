import type { Product } from "@/lib/types";

export default function ProductDetails({ product }: { product: Product }) {
  const details = product.details;
  if (!details) return null;
  return <details className="product-details">
    <summary>Product details <span aria-hidden="true">+</span></summary>
    <div className="product-details-body">
      {details.shade && <p><strong>Shade:</strong> {details.shade}</p>}
      {details.howToUse && <div><h4>How to use</h4><ol>{details.howToUse.map((step) => <li key={step}>{step}</li>)}</ol><p className="product-use-note">For rangoli and decorative use.</p></div>}
      {details.pack && <div><h4>Pack shown</h4><dl>{details.pack.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>}
      {details.madeBy && <p><strong>Made and packed by:</strong><br />{details.madeBy}</p>}
    </div>
  </details>;
}
