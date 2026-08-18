"use server";

import { connectDB } from "@/lib/db/connectDB";
import Product from "@/models/products";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to serialize MongoDB documents to match Frontend Product interface
function transformProduct(doc: any) {
  const metal = doc.metalType || "Silver";
  const purityVal = doc.purity || "925";
  const weightVal = doc.weight || "0";
  const categoryStr = doc.category || "Necklaces";
  const cleanCategorySlug = categoryStr.toLowerCase().trim().replace(/\s+/g, "-");

  // Generate a consistent SKU matching the product details
  const generatedSku = `VYSH-${metal.substring(0, 2).toUpperCase()}-${purityVal}-${weightVal.replace(/[^a-zA-Z0-9]/g, "")}`;

  return {
    _id: doc._id.toString(),
    id: doc._id.toString(),
    name: doc.name,
    subtitle: `${metal} - ${purityVal} Purity, weight: ${weightVal}`,
    category: categoryStr,
    categorySlug: cleanCategorySlug,
    price: doc.price,
    originalPrice: Math.round(doc.price * 1.2), // Default standard markup
    rating: 4.8,
    reviewsCount: 24,
    image: doc.imageUrl,
    imageUrl: doc.imageUrl,
    imagePublicId: doc.imagePublicId,
    imageVersion: doc.imageVersion,
    productCode: doc.productCode,
    sku: generatedSku,
    weight: weightVal,
    metalType: metal,
    purity: purityVal,
    stock: doc.stock,
    inStock: doc.stock > 0,
    material: `${metal} (${purityVal})`,
    description: doc.description,
    createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: doc.updatedAt?.toISOString() || doc.createdAt?.toISOString() || new Date().toISOString(),
    __v: doc.__v ?? 0,
  };
}

export interface ProductInput {
  productCode: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl?: string;
  imagePublicId?: string;
  imageVersion?: number
  weight: string;
  metalType: string;
  purity: string;
}

export async function addProductAction(productData: ProductInput) {
  try {
    await connectDB();

    const newProduct = new Product({
      productCode: productData.productCode,
      name: productData.name.trim(),
      price: Number(productData.price),
      description: productData.description.trim(),
      category: productData.category.trim(),
      stock: Number(productData.stock),
      imageUrl: productData.imageUrl,
      imagePublicId: productData.imagePublicId,
      imageVersion: 1,
      weight: productData.weight.trim(),
      metalType: productData.metalType,
      purity: productData.purity,
    });

    const saved = await newProduct.save();

    return {
      success: true,
      product: transformProduct(saved),
    };
  } catch (error: any) {
    console.error("Failed to add product:", error);
    return {
      success: false,
      error: error.message || "Failed to add product",
    };
  }
}

export async function getProductsAction() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      products: products.map((p) => transformProduct(p)),
    };
  } catch (error: any) {
    console.error("Failed to get products:", error);
    return {
      success: false,
      products: [],
      error: error.message || "Failed to fetch products",
    };
  }
}

export async function getProductsByCategoryAction(categoryName: string) {
  try {
    await connectDB();
    const products = await Product.find({
      category: { $regex: new RegExp(`^${categoryName}$`, "i") },
    }).sort({ createdAt: -1 });

    return {
      success: true,
      products: products.map((p) => transformProduct(p)),
    };
  } catch (error: any) {
    console.error("Failed to get products by category:", error);
    return {
      success: false,
      products: [],
      error: error.message || "Failed to fetch products by category",
    };
  }
}

export async function getProductsByIdAction(productId: string) {
  try {
    await connectDB()
    const product = await Product.findById(productId)
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }
    return {
      success: true,
      product: transformProduct(product)
    }
  } catch (error: any) {
    console.error("Failed to get product by id:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch product by id",
    }
  }
}

export async function updateProductAction(
  productId: string,
  productData: ProductInput
) {
  try {
    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    product.name = productData.name.trim();
    product.price = Number(productData.price);
    product.description = productData.description.trim();
    product.category = productData.category.trim();
    product.stock = Number(productData.stock);
    product.weight = productData.weight.trim();
    product.metalType = productData.metalType;
    product.purity = productData.purity;

    if (
      productData.imageUrl &&
      productData.imageUrl !== product.imageUrl
    ) {
      product.imageUrl = productData.imageUrl;
      product.imagePublicId = productData.imagePublicId;
      product.imageVersion = productData.imageVersion;
    }

    const updatedProduct = await product.save();

    return {
      success: true,
      product: transformProduct(updatedProduct),
    };
  } catch (error: any) {
    console.error("Failed to update product:", error);

    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await connectDB();

    if (!productId) {
      return {
        success: false,
        error: "Product ID is required",
      };
    }

    // 1. Find the product first
    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // 2. Delete image from Cloudinary
    if (product.imagePublicId) {
      try {
        const cloudinaryResult = await cloudinary.uploader.destroy(
          product.imagePublicId
        );

        console.log(
          `Cloudinary image deletion result:`,
          cloudinaryResult
        );

        // "ok" means deleted successfully
        // "not found" means image was already deleted
        if (
          cloudinaryResult.result !== "ok" &&
          cloudinaryResult.result !== "not found"
        ) {
          console.warn(
            `Cloudinary image could not be deleted: ${product.imagePublicId}`,
            cloudinaryResult
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete product image from Cloudinary:",
          cloudinaryError
        );

        // Stop here so we don't delete the MongoDB product
        // while leaving its image behind.
        return {
          success: false,
          error:
            "Failed to delete product image. Product was not deleted.",
        };
      }
    }

    // 3. Delete product from MongoDB
    await Product.findByIdAndDelete(productId);

    // 4. Return success
    return {
      success: true,
      message: "Product and image deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete product:", error);

    return {
      success: false,
      error: error.message || "Failed to delete product",
    };
  }
}

export const getImageVersionAction = async (productId: string) => {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) {
      return {
        success: false,
        error: "Product not found",
      }
    }

    const newImageVersion = (product.imageVersion || 1) + 1;
    return {
      success: true,
      imageVersion: newImageVersion,
      publicId: `vysh_products/${product.productCode}-v${newImageVersion}`
    }
  }

  catch (error: any) {
    console.error("Failed to update product image version:", error);

    return {
      success: false,
      error: error.message || "Failed to update product image version",
    };
  }
}
