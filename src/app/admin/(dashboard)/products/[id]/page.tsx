import { AdminProductDetailClient } from "./AdminProductDetailClient";

export const metadata = {
  title: "Product Details | Vysh Admin",
  description: "View and manage product details.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <AdminProductDetailClient productId={resolvedParams.id} />;
}