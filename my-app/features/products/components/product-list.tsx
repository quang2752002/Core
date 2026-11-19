import type { Product } from "@/features/products/types";

export function ProductList({ products }: { products: Product[] }) {
  return <div className="space-y-3">{products.map((product) => <div key={product.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4"><span>{product.name}</span><span className="text-sm capitalize text-slate-400">{product.status}</span></div>)}</div>;
}
