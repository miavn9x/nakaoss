import ProductFeaturePage from "@/features/client/product/page";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return {
    title: `Sản Phẩm - Nakao Vietnam`,
    description: `Danh mục sản phẩm linh kiện cửa Nakao Vietnam`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProductFeaturePage />;
}
