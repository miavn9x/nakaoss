import Nav from "@/features/client/nav/Nav";
import Footer from "@/features/client/footer/footer";
import BackToTop from "@/shared/backtotop/BackToTop";
import AdsDisplay from "@/features/client/ads/components/AdsDisplay";
import { categoryService } from "@/features/client/category/services/category.service";

// This is a Server Component by default in App Router
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories on server side
  const categories = await categoryService.getTreeFull();

  return (
    <>
      <AdsDisplay />
      <Nav initialCategories={categories} />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
