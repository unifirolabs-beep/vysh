import { AdminOrderDetailClient } from "./AdminOrderDetailClient";

export const metadata = {
  title: "Order Details | Vysh Admin",
  description: "View and manage customer order details.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <AdminOrderDetailClient orderId={resolvedParams.id} />;
}
