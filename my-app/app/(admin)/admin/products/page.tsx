import { ProductList } from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/services/product-service";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <div className="max-w-2xl"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Admin / Products</p><h1 className="mt-3 text-4xl font-semibold">Manage products</h1><p className="mt-3 mb-8 text-slate-400">This route is ready for product CRUD actions.</p><ProductList products={products} /></div>;
}
