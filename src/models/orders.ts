import { Schema, model, models } from "mongoose";
import OrderItemSchema from "./orderItem";

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    userPhone: {
        type: String,
        required: true,
        trim: true
    },
    userAddress: {
        type: String,
        required: true,
        trim: true
    },
    userPincode: {
        type: String,
        required: true,
        trim: true
    },
    userCity: {
        type: String,
        required: true,
        trim: true
    },
    userState: {
        type: String,
        required: true,
        trim: true
    },
    userLandmark: {
        type: String,
        trim: true
    },
    paymentMethod: {
        type: String,
        enum: ["upi", "netbanking", "wallet", "card"],
        default: "upi",
    },
    paymentStatus: {    
        type: String,
        enum: ["pending", "paid", "failed", "cancelled", "refunded"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    items: {
        type: [OrderItemSchema],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total: {
        type: Number,
        required: true
    },
    razorpayOrderId: {
        type: String,
        default: null,
    },

    razorpayPaymentId: {
        type: String,
        default: null,
    },

    razorpaySignature: {
        type: String,
        default: null,
    },
}, { timestamps: true })

const Order = models.Order || model("Order", orderSchema);
export default Order;