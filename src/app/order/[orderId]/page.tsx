import React from "react";
import { OrderClient } from "../OrderClient";

export const metadata = {
  title: "Order Details & Tracking | Vysh Pure 925 Silver",
  description: "View your order details, delivery status, and Razorpay payment receipt.",
};

interface OrderPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const resolvedParams = await params;
  return <OrderClient orderId={resolvedParams.orderId} />;
}
