"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudinaryUpload } from "@/components/admin/ImageUpload";
import { addProductAction, getProductsByIdAction, updateProductAction, getImageVersionAction } from "@/actions/products.actions";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { deleteImage } from "@/actions/cloudinary.actions";
import { generateCode } from "@/utils/generateCode";

// Zod Schema for Product Validations
const productSchema = z.object({
  productCode: z.string(),
  name: z.string().min(1, "Product name is required"),

  price: z
    .number("Price must be a number")
    .positive("Price must be a positive number"),

  stock: z
    .number("Stock must be a number")
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  description: z.string().min(1, "Description is required"),

  category: z.string().min(1, "Category is required"),

  weight: z.string().min(1, "Weight is required"),

  metalType: z.enum([
    "Gold",
    "Silver",
    "Diamond",
    "Platinum",
    "Alloy",
  ]),

  purity: z.enum([
    "999",
    "925",
    "900",
    "800",
  ]),

  imageUrl: z.string().optional(),

  imagePublicId: z.string().optional(),
  imageVersion: z.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormClientProps {
  editProductId?: string;
}

export function AddProductClient({ editProductId }: ProductFormClientProps) {
  const router = useRouter();
  const [isLoadingProduct, setIsLoadingProduct] = useState(
    Boolean(editProductId)
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageResetKey, setImageResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productCode: "",
      name: "",
      price: undefined,
      stock: undefined,
      description: "",
      category: "Necklaces",
      weight: "",
      metalType: "Silver",
      purity: "925",
      imageUrl: "",
      imagePublicId: "",
      imageVersion: undefined,
    },
  });

  useEffect(() => {
    if (!editProductId) {
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true);

        const result = await getProductsByIdAction(editProductId);

        if (!result.success || !result.product) {
          toast.error(result.error || "Product not found");
          return;
        }

        const product = result.product;

        reset({
          productCode: product.productCode,
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          category: product.category,
          weight: product.weight,
          metalType: product.metalType as ProductFormValues["metalType"],
          purity: product.purity as ProductFormValues["purity"],
          imageUrl: product.imageUrl,
          imagePublicId: product.imagePublicId,
          imageVersion: product.imageVersion as number,
        });
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [editProductId, reset]);


  const isEditMode = Boolean(editProductId);

  const onSubmit = async (data: ProductFormValues) => {
    console.log("========== SUBMIT START ==========");
    console.log("editProductId:", editProductId);
    console.log("selectedImage:", selectedImage);
    try {
      if (editProductId) {
        const oldImagePublicId = data.imagePublicId;
        let imageUrl = data.imageUrl;
        let imagePublicId = data.imagePublicId;
        const versionResult = await getImageVersionAction(editProductId);
        if (!versionResult.success || !versionResult.publicId) {
          toast.error("Error in generating image version")
          return;
        }

        if (selectedImage) {
          console.log("IMAGE SELECTED -> UPLOADING:");
          toast.loading("Uploading image...", { id: "image-upload" });

          const uploadResult = await uploadToCloudinary(selectedImage, versionResult.publicId);
          if (!uploadResult.success || !uploadResult.url || !uploadResult.publicId) {
            toast.error(uploadResult.error || "Failed to upload image", {
              id: "image-upload",
            });
            return;
          }
          imageUrl = uploadResult.url;
          imagePublicId = uploadResult.publicId;
          toast.success("Image uploaded", {
            id: "image-upload",
          });
        }

        toast.loading("Updating product...", { id: "product-submit" });

        const result = await updateProductAction(editProductId, {
          ...data,
          imageUrl,
          imagePublicId,
          imageVersion: versionResult.imageVersion,
        });

        if (!result.success) {
          if (selectedImage && imagePublicId && imagePublicId !== oldImagePublicId) {
            await deleteImage(imagePublicId);
          }
          toast.error(result.error || "Failed to update product", { id: "product-submit" });
          return;
        }

        if (oldImagePublicId && selectedImage && imagePublicId !== oldImagePublicId) {
          await deleteImage(oldImagePublicId)
        }

        toast.success("Product updated successfully", { id: "product-submit" });
        router.push("/admin/products");
        return;
      }

      const productCode = generateCode(data.category.slice(0, 3).toUpperCase());

      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      toast.loading("Uploading image...", { id: "product-submit" });
      const uploadResult = await uploadToCloudinary(selectedImage, productCode);

      if (!uploadResult.success || !uploadResult.url || !uploadResult.publicId) {
        toast.error(uploadResult.error || "Failed to upload image", {
          id: "product-submit",
        });
        return;
      }

      const productData: ProductFormValues = {
        ...data,
        productCode,
        imageUrl: uploadResult.url,
        imagePublicId: uploadResult.publicId,
      };

      toast.loading("Adding product...", { id: "product-submit" });

      const result = await addProductAction(productData);

      if (!result.success) {
        await deleteImage(uploadResult.publicId);
        toast.error(result.error || "Failed to add product", {
          id: "product-submit",
        });
        return;
      }

      toast.success("Product added successfully", { id: "product-submit" });
      reset();
      setSelectedImage(null);
      setImageResetKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error(
        editProductId ? "Failed to update product" : "Failed to add product",
        { id: "product-submit" }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => { console.log(errors) })} className="space-y-6">

      {/* ─── HEADER BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products" className="text-[#6E5D57] hover:text-[#5C061D] cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D] tracking-wide cursor-pointer">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h1>
          </div>
          <p className="text-xs text-[#6E5D57] mt-1 font-sans">
            Fill in the details below to add a new product to your database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs font-semibold text-[#1D1D1D] hover:bg-[#FFF9F8] transition-colors shadow-2xs"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 bg-[#1D1D1D] rounded-xl text-xs font-semibold text-white hover:bg-[#333333] hover:text-white transition-colors shadow-2xs hover:shadow-xs shadow-[#1D1D1D] cursor-pointer" type="submit" disabled={isSubmitting || isLoadingProduct}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </div>

      {/* ─── MAIN FORM GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: IMAGES & INVENTORY (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Product Image Card */}
          <div className="bg-white border border-[#E8D8D3] rounded-2xl p-5 space-y-4 shadow-2xs">
            <div>
              <h3 className="text-sm font-serif font-bold text-[#1D1D1D]">
                Product Image <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-[#6E5D57] mt-0.5">
                Upload a high quality image of your product to Cloudinary.
              </p>
            </div>

            <CloudinaryUpload
              key={imageResetKey}
              onImageSelect={(file: File) => {
                console.log("NEW IMAGE SELECTED:", file);
                setSelectedImage(file)
              }}
              onImageRemove={() => {
                setSelectedImage(null)
              }}
            />

          </div>

          {/* Pricing & Inventory Card */}
          <div className="bg-white border border-[#E8D8D3] rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-serif font-bold text-[#1D1D1D]">
              Pricing & Inventory
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1499"
                  {...register("price", { valueAsNumber: true })}
                  className={`w-full px-3 py-2 bg-white border ${errors.price ? "border-red-500 focus:border-red-500" : "border-[#E8D8D3] focus:border-[#5C061D]"
                    } rounded-xl text-xs text-[#1D1D1D] focus:outline-none`}
                />
                {errors.price && (
                  <span className="text-[10px] text-red-500 mt-1 block">{errors.price.message}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  {...register("stock", { valueAsNumber: true })}
                  className={`w-full px-3 py-2 bg-white border ${errors.stock ? "border-red-500 focus:border-red-500" : "border-[#E8D8D3] focus:border-[#5C061D]"
                    } rounded-xl text-xs text-[#1D1D1D] focus:outline-none`}
                />
                {errors.stock && (
                  <span className="text-[10px] text-red-500 mt-1 block">{errors.stock.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                Weight (gm) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5.24g"
                {...register("weight")}
                className={`w-full px-3 py-2 bg-white border ${errors.weight ? "border-red-500 focus:border-red-500" : "border-[#E8D8D3] focus:border-[#5C061D]"
                  } rounded-xl text-xs text-[#1D1D1D] focus:outline-none`}
              />
              {errors.weight && (
                <span className="text-[10px] text-red-500 mt-1 block">{errors.weight.message}</span>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BASIC INFO & ATTRIBUTES (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">

          {/* Basic Information Card */}
          <div className="bg-white border border-[#E8D8D3] rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-serif font-bold text-[#1D1D1D]">
              Basic Information
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Silver Om Rakhi"
                {...register("name")}
                className={`w-full px-3 py-2 bg-white border ${errors.name ? "border-red-500 focus:border-red-500" : "border-[#E8D8D3] focus:border-[#5C061D]"
                  } rounded-xl text-xs text-[#1D1D1D] focus:outline-none`}
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 mt-1 block">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] outline-none cursor-pointer focus:border-[#5C061D]"
              >
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Rings">Rings</option>
                <option value="Pendants">Pendants</option>
                <option value="Bangles">Bangles</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Anklets">Anklets</option>
                <option value="Rakhis">Rakhis</option>
              </select>
              {errors.category && (
                <span className="text-[10px] text-red-500 mt-1 block">{errors.category.message}</span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Write a descriptive product bio..."
                {...register("description")}
                className={`w-full px-3 py-2 bg-white border ${errors.description ? "border-red-500 focus:border-red-500" : "border-[#E8D8D3] focus:border-[#5C061D]"
                  } rounded-xl text-xs text-[#1D1D1D] focus:outline-none`}
              />
              {errors.description && (
                <span className="text-[10px] text-red-500 mt-1 block">{errors.description.message}</span>
              )}
            </div>
          </div>

          {/* Product Attributes Card */}
          <div className="bg-white border border-[#E8D8D3] rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-serif font-bold text-[#1D1D1D]">
              Product Attributes
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                  Metal Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("metalType")}
                  className="w-full px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] outline-none cursor-pointer focus:border-[#5C061D]"
                >
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Alloy">Alloy</option>
                </select>
                {errors.metalType && (
                  <span className="text-[10px] text-red-500 mt-1 block">{errors.metalType.message}</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                  Purity <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("purity")}
                  className="w-full px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] outline-none cursor-pointer focus:border-[#5C061D]"
                >
                  <option value="999">999 (Fine)</option>
                  <option value="925">925 (Sterling)</option>
                  <option value="900">900 (Coin)</option>
                  <option value="800">800 (Jewellery)</option>
                </select>
                {errors.purity && (
                  <span className="text-[10px] text-red-500 mt-1 block">{errors.purity.message}</span>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
