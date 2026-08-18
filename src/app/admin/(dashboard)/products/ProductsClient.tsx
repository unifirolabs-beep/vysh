"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  RotateCcw,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";

import { getProductsAction, deleteProductAction } from "@/actions/products.actions";

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl: string;
  imagePublicId: string;
  weight: string;
  metalType: "Gold" | "Silver" | "Diamond" | "Platinum" | "Alloy";
  purity: "999" | "925" | "900" | "800";
}

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /*
   * Load products
   */
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await getProductsAction();

      if (result.success) {
        setProducts(result.products || []);
      } else {
        toast.error(result.error || "Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /*
   * Delete product
   */
  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    const targetId = product.id || product._id;
    try {
      setDeletingId(targetId);

      const result = await deleteProductAction(targetId);

      if (result.success) {
        toast.success("Product deleted successfully");

        setProducts((prev) =>
          prev.filter((item) => (item.id || item._id) !== targetId)
        );
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Filtering
   */
  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.category.toLowerCase().includes(searchValue) ||
      product.metalType.toLowerCase().includes(searchValue) ||
      product.purity.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryFilter === "All Categories" ||
      product.category === categoryFilter;

    const matchesStock =
      stockFilter === "All" ||
      (stockFilter === "In Stock" && product.stock > 0) ||
      (stockFilter === "Out of Stock" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  /*
   * Reset filters
   */
  const handleReset = () => {
    setSearch("");
    setCategoryFilter("All Categories");
    setStockFilter("All");
  };

  /*
   * Category badge
   */
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Necklaces":
        return "bg-[#FDF2F4] text-[#A3183F]";

      case "Earrings":
        return "bg-[#F5F0FF] text-[#7E22CE]";

      case "Rings":
        return "bg-[#FFFBEB] text-[#B45309]";

      case "Pendants":
        return "bg-[#EFF6FF] text-[#1D4ED8]";

      case "Bangles":
        return "bg-[#FDF2F8] text-[#BE185D]";

      case "Bracelets":
        return "bg-[#FDF2F4] text-[#A3183F]";

      case "Anklets":
        return "bg-[#F0FDFA] text-[#0F766E]";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /*
   * Stock badge
   */
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold">
          Out of Stock
        </span>
      );
    }

    if (stock <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold">
          Low Stock ({stock})
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
        In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D] tracking-wide">
            Products
          </h1>

          <p className="text-xs text-[#6E5D57] mt-1">
            Manage your silver products and inventory.
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="px-4 py-2.5 bg-[#E5C158] hover:bg-[#D4AF37] text-[#160408] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Product count */}
      <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center">
            <Package className="w-5 h-5 text-[#5C061D]" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#6E5D57]">
              Total Products
            </p>

            <p className="text-xl font-bold text-[#1D1D1D]">
              {products.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white border border-[#E8D8D3] rounded-2xl p-3.5 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-2.5" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] placeholder:text-[#888] focus:outline-none focus:border-[#5C061D]"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs font-medium text-[#1D1D1D] outline-none"
          >
            <option>All Categories</option>
            <option>Necklaces</option>
            <option>Earrings</option>
            <option>Rings</option>
            <option>Pendants</option>
            <option>Bangles</option>
            <option>Bracelets</option>
            <option>Anklets</option>
            <option>Rakhis</option>
          </select>

          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs font-medium text-[#1D1D1D] outline-none"
          >
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-[#6E5D57] hover:text-[#5C061D] flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* View mode */}
          <div className="flex items-center gap-1 bg-[#FAF8F6] p-1 rounded-xl border border-[#E8D8D3]">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-[#5C061D] text-white"
                  : "text-[#6E5D57]"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-[#5C061D] text-white"
                  : "text-[#6E5D57]"
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#E8D8D3] border-t-[#5C061D] rounded-full animate-spin mx-auto" />

          <p className="text-xs text-[#6E5D57] mt-3">
            Loading products...
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-12 text-center">
          <Package className="w-10 h-10 text-[#C8B8B2] mx-auto" />

          <h3 className="text-sm font-bold text-[#1D1D1D] mt-3">
            No products found
          </h3>

          <p className="text-xs text-[#6E5D57] mt-1">
            {products.length === 0
              ? "Start by adding your first product."
              : "Try changing your search or filters."}
          </p>

          {products.length === 0 && (
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-[#5C061D] text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          )}
        </div>
      )}

      {/* Products */}
      {!isLoading && filteredProducts.length > 0 && (
        <>
          {viewMode === "list" ? (
            <div className="overflow-x-auto rounded-2xl border border-[#E8D8D3] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-[#6E5D57] border-b border-[#E8D8D3]">
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Metal</th>
                    <th className="py-3 px-4">Purity</th>
                    <th className="py-3 px-4">Weight</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0E2DE]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FFF9F8] transition-colors"
                    >
                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#FAF8F6] border border-[#E8D8D3] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-[#1D1D1D] truncate max-w-[180px]">
                              {product.name}
                            </h4>

                            <p className="text-[10px] text-[#6E5D57] mt-0.5 truncate max-w-[180px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getCategoryBadgeClass(
                            product.category
                          )}`}
                        >
                          {product.category}
                        </span>
                      </td>

                      {/* Metal */}
                      <td className="py-3.5 px-4 font-medium text-[#6E5D57]">
                        {product.metalType}
                      </td>

                      {/* Purity */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#5C061D]">
                          {product.purity}
                        </span>
                      </td>

                      {/* Weight */}
                      <td className="py-3.5 px-4 text-[#6E5D57]">
                        {product.weight}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-[#A3183F]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        {getStockBadge(product.stock)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              toast.info(`Viewing ${product.name}`)
                            }
                            className="p-1.5 rounded-lg text-[#6E5D57] hover:text-[#5C061D] hover:bg-[#FAF8F6]"
                            title="View Product"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </button>

                          <Link
                            href={`/admin/products/add?edit=${product.id}`}
                            className="p-1.5 rounded-lg text-[#6E5D57] hover:text-[#5C061D] hover:bg-[#FAF8F6]"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            disabled={deletingId === product.id}
                            onClick={() => handleDelete(product)}
                            className="p-1.5 rounded-lg text-[#6E5D57] hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8D8D3] rounded-2xl overflow-hidden group hover:border-[#5C061D]/40 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-[#FFF9F8] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />

                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold ${getCategoryBadgeClass(
                        product.category
                      )}`}
                    >
                      {product.category}
                    </span>

                    <div className="absolute top-3 right-3">
                      {getStockBadge(product.stock)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1D1D1D] truncate">
                        {product.name}
                      </h3>

                      <p className="text-[10px] text-[#6E5D57] mt-1">
                        {product.metalType} • {product.purity} •{" "}
                        {product.weight}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#A3183F]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-[10px] text-[#6E5D57]">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/admin/products/add?edit=${product.id}`}
                        className="flex-1 py-2 rounded-xl bg-[#5C061D] text-white text-[10px] font-bold flex items-center justify-center gap-1.5"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={deletingId === product._id}
                        onClick={() => handleDelete(product)}
                        className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between text-xs text-[#6E5D57]">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      )}
    </div>
  );
}

