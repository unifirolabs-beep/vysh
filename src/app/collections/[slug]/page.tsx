import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/data/collections";
import { CollectionSlugClient } from "./CollectionSlugClient";
import { getProductsByCategoryAction } from "@/actions/products.actions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function CollectionSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const dbRes = await getProductsByCategoryAction(collection.categoryName);
  const initialDbProducts = dbRes.success ? dbRes.products : [];

  return (
    <CollectionSlugClient
      collection={collection}
      initialDbProducts={initialDbProducts}
    />
  );
}
