import React from "react";
import { OrdersClient } from "./OrdersClient";

export const metadata = {
  title: "Orders | Vysh Jewellery Admin",
  description: "Track and manage customer orders and shipments.",
};

export default function AdminOrdersPage() {
  return <OrdersClient />;
}
