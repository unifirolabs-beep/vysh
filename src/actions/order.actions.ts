"use server";

import { connectDB } from "@/lib/db/connectDB";
import Order from "@/models/orders";
import Product from "@/models/products";
import Razorpay from "razorpay";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { generateCode } from "@/utils/generateCode";
import mongoose from "mongoose";

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key_vysh";

function getRazorpayInstance() {
  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

export interface CreateOrderItem {
  productId?: string;
  productCode: string;
  productName: string;
  productPrice: number;
  quantity: number;
  imageUrl?: string;
  weight?: number;
  metalType?: string;
  purity?: string;
  total: number;
}

export interface CreateOrderParams {
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
  userPincode: string;
  userCity: string;
  userState: string;
  userLandmark?: string;
  paymentMethod?: "upi" | "netbanking" | "wallet" | "card";
  items: CreateOrderItem[];
  quantity: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus?: "pending" | "paid" | "failed";
}

/**
 * Server Action: Create Razorpay Order
 */
export async function createRazorpayOrderAction(amount: number) {
  try {
    if (!amount || amount <= 0) {
      return { success: false, message: "Invalid amount for order creation" };
    }

    // Amount in paise for INR
    const amountInPaise = Math.round(amount * 100);

    const razorpay = getRazorpayInstance();
    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      payment_capture: 1,
    };

    const rzpOrder = await razorpay.orders.create(orderOptions);

    return {
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: razorpayKeyId,
    };
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return {
      success: false,
      message: error?.message || "Failed to create Razorpay order",
    };
  }
}

/**
 * Server Action: Create/Update Order in MongoDB
 */
export async function createOrderAction(params: CreateOrderParams) {
  await connectDB();
  await Order.syncIndexes().catch(() => {});
  const session = await mongoose.startSession();
  const topologyType = (mongoose.connection as any).client?.topology?.description?.type;
  const useTransaction = topologyType === "ReplicaSetWithPrimary" || topologyType === "Sharded";

  try {
    if (useTransaction) {
      session.startTransaction();
    }

    let paymentStatus: "pending" | "paid" | "failed" = "pending";
    let paymentMethod: "upi" | "card" | "netbanking" | "wallet" | null = null;

    // 1. Razorpay Verification
    if (
      params.razorpayOrderId &&
      params.razorpayPaymentId &&
      params.razorpaySignature
    ) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
        .digest("hex");

      const isVerified = generatedSignature === params.razorpaySignature;

      if (!isVerified) {
        if (useTransaction && session.inTransaction()) {
          await session.abortTransaction();
        }
        return {
          success: false,
          message: "Invalid Razorpay payment signature.",
        };
      }

      const razorpay = getRazorpayInstance();
      const payment = await razorpay.payments.fetch(
        params.razorpayPaymentId
      );

      if (payment.order_id !== params.razorpayOrderId) {
        if (useTransaction && session.inTransaction()) {
          await session.abortTransaction();
        }
        return {
          success: false,
          message: "Payment does not belong to this order.",
        };
      }

      if (payment.status === "captured") {
        paymentStatus = "paid";
      } else if (payment.status === "failed") {
        paymentStatus = "failed";
      } else {
        paymentStatus = "pending";
      }

      const allowedMethods = ["upi", "card", "netbanking", "wallet"];
      if (payment.method && allowedMethods.includes(payment.method)) {
        paymentMethod = payment.method as
          | "upi"
          | "card"
          | "netbanking"
          | "wallet";
      } else {
        if (useTransaction && session.inTransaction()) {
          await session.abortTransaction();
        }
        return {
          success: false,
          message: `Unsupported payment method: ${payment.method}`,
        };
      }
    }

    // 2. Decrement Stock
    for (const item of params.items) {
      if (item.productId && item.quantity > 0) {
        const product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          {
            returnDocument: "after",
            ...(useTransaction ? { session } : {}),
          }
        );

        if (!product) {
          throw new Error(`Insufficient stock for ${item.productName}`);
        }
      }
    }

    // 3. Create Order Document
    const orderId = generateCode("ORD");

    const orderData = {
      orderId,
      userName: params.userName,
      userEmail: params.userEmail,
      userPhone: params.userPhone,
      userAddress: params.userAddress,
      userPincode: params.userPincode,
      userCity: params.userCity,
      userState: params.userState,
      userLandmark: params.userLandmark || "",

      paymentMethod,
      paymentStatus,
      orderStatus: paymentStatus === "paid" ? "Confirmed" : "Pending",

      items: params.items.map((item) => ({
        productId:
          item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId)
            ? item.productId
            : undefined,
        productCode: item.productCode,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        weight: item.weight,
        metalType: item.metalType,
        purity: item.purity,
        total: item.total,
      })),
      quantity: params.quantity,
      total: params.total,

      razorpayOrderId: params.razorpayOrderId || null,
      razorpayPaymentId: params.razorpayPaymentId || null,
      razorpaySignature: params.razorpaySignature || null,
    };

    let newOrder: any;
    if (useTransaction) {
      const [created] = await Order.create([orderData], { session });
      newOrder = created;
    } else {
      newOrder = await Order.create(orderData);
    }

    // 4. Commit Transaction if active
    if (useTransaction && session.inTransaction()) {
      await session.commitTransaction();
    }

    return {
      success: true,
      orderId: newOrder._id.toString(),
      customOrderId: newOrder.orderId,
      order: JSON.parse(JSON.stringify(newOrder)),
    };
  } catch (error: any) {
    if (useTransaction && session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Error creating order in MongoDB:", error);
    return {
      success: false,
      message: error?.message || "Failed to save order to database",
    };
  } finally {
    await session.endSession();
  }
}

/**
 * Server Action: Fetch Order Details by Order ID or Mongo ID
 */
export async function getOrderDetailsAction(orderId: string) {
  try {
    await connectDB();
    // Ensure product schema is registered
    const _dummyProduct = Product;

    let query: any = { orderId: orderId };

    // If orderId is a valid 24-char hex string, also search by _id
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      query = { $or: [{ _id: orderId }, { orderId: orderId }] };
    }

    const order = await Order.findOne(query).lean();

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order)),
    };
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch order details",
    };
  }
}

/**
 * Server Action: Fetch All Orders for Admin Dashboard
 */
export async function getAdminOrdersAction() {
  try {
    await connectDB();
    const _dummyProduct = Product;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return {
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error: any) {
    console.error("Error fetching admin orders:", error);
    return {
      success: false,
      orders: [],
      message: error?.message || "Failed to fetch orders",
    };
  }
}

/**
 * Server Action: Update Order Status in MongoDB
 */
export async function updateOrderStatusAction(
  orderId: string,
  newOrderStatus: string,
  newPaymentStatus?: string
) {
  try {
    await connectDB();

    let query: any = { orderId: orderId };
    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      query = { $or: [{ _id: orderId }, { orderId: orderId }] };
    }

    const updateFields: any = {
      orderStatus: newOrderStatus,
    };

    if (newPaymentStatus) {
      updateFields.paymentStatus = newPaymentStatus;
    } else if (newOrderStatus === "Delivered") {
      updateFields.paymentStatus = "Paid";
    }

    const updatedOrder = await Order.findOneAndUpdate(query, updateFields, {
      new: true,
    }).lean();

    if (!updatedOrder) {
      return { success: false, message: "Order not found for update" };
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      order: JSON.parse(JSON.stringify(updatedOrder)),
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      message: error?.message || "Failed to update order status",
    };
  }
}
