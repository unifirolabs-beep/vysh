import React from "react";
import { OrderClient } from "./OrderClient";

export const metadata = {
  title: "Order Details & Tracking | Vysh Pure 925 Silver",
  description: "View your order details, delivery status, and payment receipt.",
};

interface OrderPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function OrderQueryPage({ searchParams }: OrderPageProps) {
  const resolvedSearchParams = await searchParams;
  return <OrderClient orderId={resolvedSearchParams.orderId || ""} />;
}
