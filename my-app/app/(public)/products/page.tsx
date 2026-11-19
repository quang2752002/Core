import { ProductList } from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/services/product-service";

export default async function PublicProductsPage() {
  const products = await getProducts();
  return <div className="max-w-2xl"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Public catalog</p><h1 className="mt-3 text-4xl font-semibold">Products</h1><p className="mt-3 mb-8 text-slate-400">Products displayed on the public website.</p><ProductList products={products} /></div>;
}
