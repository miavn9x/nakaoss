import ProductDetailPage from "@/features/client/product/components/ProductDetailPage";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Chi tiết sản phẩm ${id} - Nakao Vietnam`,
    description: `Thông tin chi tiết sản phẩm ${id} - Nakao Vietnam`,
  };
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // TODO: Truyền id xuống component để fetch data từ API
  return <ProductDetailPage />;
}
