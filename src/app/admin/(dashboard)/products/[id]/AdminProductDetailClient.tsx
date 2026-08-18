"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductsByIdAction } from "@/actions/products.actions";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  Eye,
  Copy,
  Check,
  Package,
  Tag,
  Coins,
  ShieldCheck,
  Scale,
  Calendar,
  Sparkles,
  ExternalLink,
  ImageIcon,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  Database,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminProductDetailClientProps {
  productId: string;
}

export function AdminProductDetailClient({ productId }: AdminProductDetailClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductsByIdAction(productId);
      if (res.success && res.product) {
        setProduct(res.product);
      } else {
        setError(res.error || "Product not found in database.");
      }
    } catch (err: any) {
      console.error("Failed to load product details:", err);
      setError(err?.message || "An error occurred while fetching product details.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
          <div className="h-8 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-[450px] bg-gray-200 rounded-2xl" />
          <div className="lg:col-span-7 h-[450px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="p-8 bg-red-50/70 border border-red-200 rounded-3xl space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-red-950">Failed to Load Product</h2>
          <p className="text-sm text-red-700 max-w-md mx-auto">{error || "Product could not be retrieved."}</p>
          <div className="pt-2">
            <Link href="/admin/products">
              <Button className="bg-[#5C061D] hover:bg-[#7A0A28] text-white rounded-xl px-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockCount = typeof product.stock === "number" ? product.stock : 0;
  const isOutOfStock = stockCount <= 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 text-[#2D221E]">
      {/* Top Header / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8D8D3] shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="rounded-xl border-[#E8D8D3] hover:bg-[#FAF6F0] text-[#5C061D]">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
            </Button>
          </Link>
          <div className="h-5 w-px bg-[#E8D8D3] hidden sm:block" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#FAF6F0] text-[#5C061D] border border-[#E8D8D3]">
                {product.productCode || "NO-CODE"}
              </span>
              <Badge className="bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-100 gap-1.5 py-1 px-3">
                <Lock className="w-3 h-3 text-amber-700" /> Read-Only Viewing Mode
              </Badge>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#2D221E] mt-1">{product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(product.productCode || "", "Product Code")}
            className="rounded-xl border-[#E8D8D3] text-[#5C061D] hover:bg-[#FAF6F0] text-xs"
          >
            {copiedField === "Product Code" ? <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            Copy Code
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(product._id || product.id || "", "MongoDB ID")}
            className="rounded-xl border-[#E8D8D3] text-[#5C061D] hover:bg-[#FAF6F0] text-xs"
          >
            {copiedField === "MongoDB ID" ? <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Database className="w-3.5 h-3.5 mr-1" />}
            Copy ID
          </Button>

          {product.imageUrl && (
            <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#5C061D] hover:bg-[#7A0A28] text-white rounded-xl text-xs">
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Image
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Price Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8D8D3] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#FAF6F0] text-[#5C061D] rounded-xl">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6E5D57] font-medium">Selling Price</p>
            <p className="text-lg font-bold text-[#5C061D]">₹{product.price?.toLocaleString("en-IN") || 0}</p>
          </div>
        </div>

        {/* Stock Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8D8D3] shadow-sm flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6E5D57] font-medium">Inventory Stock</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-base font-bold ${isOutOfStock ? "text-red-600" : "text-emerald-700"}`}>
                {stockCount} {stockCount === 1 ? "unit" : "units"}
              </span>
              <Badge className={`text-[10px] px-1.5 py-0 ${isOutOfStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"}`}>
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Category Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8D8D3] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#FAF6F0] text-[#C9A227] rounded-xl">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6E5D57] font-medium">Category</p>
            <p className="text-base font-bold text-[#2D221E]">{product.category || "Uncategorized"}</p>
          </div>
        </div>

        {/* Metal & Purity Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8D8D3] shadow-sm flex items-center gap-3">
          <div className="p-3 bg-[#FAF6F0] text-[#5C061D] rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#6E5D57] font-medium">Metal / Purity</p>
            <p className="text-base font-bold text-[#2D221E]">
              {product.metalType || "Silver"} ({product.purity || "925"})
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Preview & Media Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Image Showcase Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8D8D3] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#2D221E] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#5C061D]" /> Product Image Preview
              </h3>
              <Badge variant="outline" className="text-[10px] text-[#6E5D57] border-[#E8D8D3]">
                {product.imageVersion ? `v${product.imageVersion}` : "Primary"}
              </Badge>
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#F0E8E6] flex items-center justify-center group">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              ) : (
                <div className="text-center p-6 text-[#8C7A74]">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No product image available</p>
                </div>
              )}
            </div>

            {/* Cloudinary Metadata */}
            <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E8D8D3] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6E5D57]">
                <span>Cloudinary Public ID</span>
                <button
                  onClick={() => handleCopy(product.imagePublicId || "", "Public ID")}
                  className="text-[#5C061D] font-mono hover:underline flex items-center gap-1 text-[11px]"
                >
                  {product.imagePublicId || "N/A"}
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              {product.imageUrl && (
                <div className="flex items-center justify-between text-[#6E5D57] pt-1 border-t border-[#E8D8D3]/60">
                  <span>Image Direct URL</span>
                  <button
                    onClick={() => handleCopy(product.imageUrl, "Image URL")}
                    className="text-[#5C061D] font-mono hover:underline flex items-center gap-1 text-[11px] truncate max-w-[180px]"
                  >
                    Truncated URL...
                    <Copy className="w-3 h-3 flex-shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* System Audit & Database Details */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8D8D3] shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#2D221E] flex items-center gap-2 border-b border-[#F0E8E6] pb-2.5">
              <Database className="w-4 h-4 text-[#5C061D]" /> Database Record Metadata
            </h3>

            <div className="space-y-2.5 text-xs text-[#2D221E]">
              <div className="flex justify-between items-center py-1 border-b border-[#FAF6F0]">
                <span className="text-[#6E5D57] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#8C7A74]" /> MongoDB _id:
                </span>
                <span className="font-mono text-[11px] bg-[#FAF6F0] px-2 py-0.5 rounded text-[#5C061D] border border-[#E8D8D3]">
                  {product._id || product.id}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#FAF6F0]">
                <span className="text-[#6E5D57] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7A74]" /> Created At:
                </span>
                <span className="font-medium text-[#2D221E]">{formatDate(product.createdAt)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#FAF6F0]">
                <span className="text-[#6E5D57] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8C7A74]" /> Last Updated At:
                </span>
                <span className="font-medium text-[#2D221E]">{formatDate(product.updatedAt)}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#6E5D57] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#8C7A74]" /> Version Key (__v):
                </span>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#FAF6F0] rounded text-[#2D221E]">
                  {product.__v ?? 0}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900 mt-2">
              <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>This record is rendered in <strong>Read-Only Mode</strong>. Data modifications and form submissions are disabled.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Specs & Description */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Product Attributes Table / Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8D8D3] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E8E6] pb-3">
              <h3 className="font-bold text-base text-[#2D221E] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#5C061D]" /> Specifications & Attributes
              </h3>
              <span className="text-xs text-[#8C7A74]">ID: {product.productCode}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5C061D]" /> Product Name
                </p>
                <p className="text-sm font-bold text-[#2D221E]">{product.name}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Product Code
                </p>
                <p className="text-sm font-bold font-mono text-[#5C061D]">{product.productCode}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#5C061D]" /> Price (INR)
                </p>
                <p className="text-sm font-bold text-[#5C061D]">₹{product.price?.toLocaleString("en-IN")}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#5C061D]" /> Available Stock
                </p>
                <p className="text-sm font-bold text-[#2D221E]">{product.stock} units</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5C061D]" /> Metal Type
                </p>
                <p className="text-sm font-bold text-[#2D221E]">{product.metalType || "Silver"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5C061D]" /> Purity Hallmark
                </p>
                <p className="text-sm font-bold text-[#2D221E]">{product.purity || "925"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#E8D8D3]/70 space-y-1 sm:col-span-2">
                <p className="text-xs text-[#6E5D57] font-medium flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#5C061D]" /> Weight
                </p>
                <p className="text-sm font-bold text-[#2D221E]">
                  {product.weight ? `${product.weight}g` : "0g (Standard)"}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8D8D3] shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#2D221E] flex items-center gap-2 border-b border-[#F0E8E6] pb-3">
              <Eye className="w-4 h-4 text-[#5C061D]" /> Product Description
            </h3>

            {product.description ? (
              <div className="text-sm text-[#4A3B36] leading-relaxed whitespace-pre-line bg-[#FAF6F0]/50 p-4 rounded-xl border border-[#E8D8D3]/50">
                {product.description}
              </div>
            ) : (
              <p className="text-sm text-[#8C7A74] italic">No description provided for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductDetailClient;