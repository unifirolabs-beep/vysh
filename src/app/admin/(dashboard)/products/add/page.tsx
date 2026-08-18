import { AddProductClient } from "./AddProductClient";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export const metadata = {
  title: "Add New Product | Vysh Jewellery Admin",
  description: "Create and publish new luxury jewellery products.",
};

export default async function AdminAddProductPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <AddProductClient
      editProductId={params.edit}
    />
  );
}
