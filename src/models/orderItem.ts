import { Schema } from "mongoose";

const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: false,
        trim: true,
    },

    productCode: {
        type: String,
        required: true,
        trim: true,
    },

    productName: {
        type: String,
        required: true,
        trim: true,
    },

    productPrice: {
        type: Number,
        required: true,
        trim: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
        trim: true,
    },
    
    imageUrl: {
      type: String,
      required: false,
    },

    weight: {
      type: Number,
      required: false,
    },

    metalType: {
      type: String,
      required: false,
    },

    purity: {
      type: String,
      required: false,
    },

    total: {
        type: Number,
        required: true,
        trim: true,
    },
})

export default orderItemSchema;
