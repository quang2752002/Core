import type { Product } from "@/features/products/types";

const products: Product[] = [
  { id: "prod_1", name: "Starter plan", status: "active" },
  { id: "prod_2", name: "Enterprise plan", status: "draft" },
];

export async function getProducts(): Promise<Product[]> {
  return products;
}
