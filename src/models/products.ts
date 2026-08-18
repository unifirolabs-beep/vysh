import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },  
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    imageVersion: {
      type: Number,
      default: 1,
    },

    weight: {
      type: String,
      required: true,
    },

    metalType: {
      type: String,
      enum: ["Gold", "Silver", "Diamond", "Platinum", "Alloy"],
      required: true,
    },

    purity: {
      type: String,
      enum: ["999", "925", "900", "800"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model("Product", productSchema);

export default Product;