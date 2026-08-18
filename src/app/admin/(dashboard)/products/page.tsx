import React from "react";
import { ProductsClient } from "./ProductsClient";

export const metadata = {
  title: "All Products | Vysh Jewellery Admin",
  description: "Manage product inventory, prices, and stock for Vysh Jewellery.",
};

export default function AdminProductsPage() {
  return <ProductsClient />;
}
