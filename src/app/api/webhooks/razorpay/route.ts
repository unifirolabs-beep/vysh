import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connectDB";
import Order from "@/models/orders";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "mock_secret_key_vysh";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const razorpaySignature = req.headers.get("x-razorpay-signature");

    if (!razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.warn("Razorpay Webhook: Invalid signature mismatch");
      return NextResponse.json(
        { success: false, message: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Razorpay Webhook received event: ${event}`);

    await connectDB();

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            paymentStatus: "Paid",
            orderStatus: "Confirmed",
            razorpayPaymentId: paymentId || null,
          }
        );
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            paymentStatus: "Failed",
          }
        );
      }
    }

    return NextResponse.json({ status: "ok", success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Webhook handling error" },
      { status: 500 }
    );
  }
}
