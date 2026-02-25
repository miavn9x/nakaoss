import React from "react";
import PostContent from "@/features/client/post/components/PostContent";
import PostSidebar from "@/features/client/post/components/PostSidebar";
import PostDetailClient from "@/features/client/post/components/PostDetailClient";
import CategoryListContent from "../../../../features/client/post/components/CategoryListContent";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  getPostDetailServer,
  getPostsServer,
} from "@/features/client/post/services/post.server";
import {
  getCategoryName,
  getCategoryPath,
  getCategoryCodeByPath,
} from "@/features/client/post/services/category_hierarchy";
import { Metadata } from "next";
import { getPostLink } from "@/features/client/post/types/post.types";

export const revalidate = 600;

interface UniversalPageProps {
  params: Promise<{
    locale: string;
    category: string[];
  }>;
}

// SSG: Pre-render some paths
export async function generateStaticParams() {
  const locales = ["vi", "en", "cn", "bo"];
  const [{ items: latest }, { items: featured }] = await Promise.all([
    getPostsServer("page=1&limit=5&isNew=true"),
    getPostsServer("page=1&limit=5&isFeatured=true"),
  ]);

  const posts = [...latest, ...featured];
  const paths: { locale: string; category: string[] }[] = [];

  for (const post of posts) {
    const detail = post.details.find((d) => d.lang === "vi") || post.details[0];
    if (!detail) continue;

    // Slug format: slug-code
    const postSlug = `${detail.slug}-${post.code}`;

    // Nếu có categoryPath thì dùng, nếu không thì dùng fallback code
    const catPath = post.categoryPath || [
      post.category.toLowerCase().replace(/_/g, "-"),
    ];

    for (const locale of locales) {
      paths.push({
        locale,
        category: [...catPath, postSlug],
      });
    }
  }

  return paths;
}

// Kiểm tra xem segment cuối cùng có phải là mã bài viết không (Hỗ trợ AlphaNumeric Hex)
const isPostSlug = (slug: string) => /-POST[A-Z0-9]+$/i.test(slug);

export async function generateMetadata({
  params,
}: UniversalPageProps): Promise<Metadata> {
  const { category, locale } = await params;
  const lastSegment = category[category.length - 1];

  if (isPostSlug(lastSegment)) {
    const parts = lastSegment.split("-");
    const code = parts[parts.length - 1];

    // Lấy token từ cookie để xem được bài MEMBERS_ONLY khi generate metadata
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const post = await getPostDetailServer(code, locale, token);

    if (!post) return { title: "Bài viết không tồn tại" };

    const currentDetail =
      post.details.find((d) => d.lang === locale) || post.details[0];

    const { APP_URL } = await import("@/shared/config/api.config");
    const languages = ["vi", "en", "cn", "bo"];

    // Tạo alternates cho SEO đa ngôn ngữ (Sử dụng APP_URL tập trung)
    const alternates: Record<string, string> = {};
    languages.forEach((lang) => {
      const link = getPostLink(post, lang);
      const fullPath = lang === "vi" ? link : `/${lang}${link}`;
      alternates[lang] = `${APP_URL}${fullPath}`;
    });

    return {
      title: currentDetail?.title,
      description: currentDetail?.description,
      alternates: {
        canonical: alternates[locale],
        languages: alternates,
      },
      openGraph: {
        title: currentDetail?.title,
        description: currentDetail?.description,
        images: [post.cover?.url || ""],
        type: "article",
        publishedTime: post.createdAt,
      },
      twitter: {
        card: "summary_large_image",
        title: currentDetail?.title,
        description: currentDetail?.description,
        images: [post.cover?.url || ""],
      },
    };
  }

  // Meta cho đặc biệt
  const specialTitles: Record<string, Record<string, string>> = {
    "tin-moi": {
      vi: "Tin Tức Mới Nhất",
      en: "Latest News",
      zh: "最新消息",
      bo: "གསར་འགྱུར་གསར་ཤོས།",
    },
    "tin-noi-bat": {
      vi: "Tin Tức Nổi Bật",
      en: "Featured News",
      zh: "精选新闻",
      bo: "གསར་འགྱུར་གནད་ཆེན།",
    },
  };

  if (lastSegment === "tin-moi" || lastSegment === "tin-noi-bat") {
    return {
      title:
        specialTitles[lastSegment][locale] || specialTitles[lastSegment].vi,
    };
  }

  // Meta cho danh mục
  const categoryCode = await getCategoryCodeByPath(category);
  const catName = categoryCode
    ? await getCategoryName(categoryCode, locale)
    : lastSegment;

  const categoryTitles: Record<string, string> = {
    vi: `Danh mục: ${catName}`,
    en: `Category: ${catName}`,
    zh: `分类: ${catName}`,
    bo: `སྡེ་ཚན: ${catName}`,
  };

  return {
    title: categoryTitles[locale] || categoryTitles.vi,
  };
}

const UniversalCategoryPage = async ({ params }: UniversalPageProps) => {
  const { category, locale } = await params;
  const lastSegment = category[category.length - 1];

  // TRƯỜNG HỢP 1: CHI TIẾT BÀI VIẾT
  if (isPostSlug(lastSegment)) {
    const parts = lastSegment.split("-");
    const code = parts[parts.length - 1];

    // Lấy token từ cookie cho Server-side fetch
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // TỐI ƯU: Fetch Bài viết và Sidebar song song
    const [post, { items: latest }, { items: featured }] = await Promise.all([
      getPostDetailServer(code, locale, token),
      getPostsServer("page=1&limit=5&isNew=true", locale, token),
      getPostsServer("page=1&limit=5&isFeatured=true", locale, token),
    ]);

    if (!post) {
      // Nếu không có post trên Server, fallback cho Client hoặc 404
      return <PostDetailClient code={code} />;
    }

    // Enrichment xử lý song song
    const [categoryName, categoryPath] = await Promise.all([
      getCategoryName(post.category, locale),
      getCategoryPath(post.category, locale),
    ]);

    post.categoryName = categoryName;
    post.categoryPath = categoryPath;

    const currentPath = `/${category.join("/")}`;
    const correctLink = getPostLink(post, locale);

    if (
      correctLink !== currentPath &&
      correctLink !== `/${locale}${currentPath}`
    ) {
      // Manual locale prefixing for next/navigation redirect
      const finalLink =
        locale === "vi" ? correctLink : `/${locale}${correctLink}`;
      return redirect(finalLink);
    }

    // --- SEO: Structured Data (JSON-LD) ---
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline:
        post.details.find((d) => d.lang === locale)?.title ||
        post.details[0].title,
      image: [post.cover?.url || ""],
      dateModified: post.updatedAt || post.createdAt,
      author: [
        {
          "@type": "Organization",
          name: "Phật Giáo",
          url: "https://phatgiao.vn",
        },
      ],
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      numberOfItems: categoryPath.length + 1,
      itemListElement: [
        ...categoryPath.map((cat: any, idx: number) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: cat.name,
          item: `https://phatgiao.vn${locale === "vi" ? "" : `/${locale}`}/${category.slice(0, idx + 1).join("/")}`,
        })),
        {
          "@type": "ListItem",
          position: categoryPath.length + 1,
          name:
            post.details.find((d) => d.lang === locale)?.title ||
            post.details[0].title,
          item: `https://phatgiao.vn${locale === "vi" ? "" : `/${locale}`}/${category.join("/")}`,
        },
      ],
    };

    return (
      <div className=" bg-[#fdfce8] min-h-screen">
        {/* Inject JSON-LD */}
        <Script
          id="post-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(jsonLd)),
          }}
        />
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(breadcrumbJsonLd)),
          }}
        />

        <div className="container mx-auto py-8 lg:py-12 px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <main className="lg:w-[75%] post-detail-content">
              <PostContent post={post} />
            </main>
            <div className="lg:w-[25%] border-t lg:border-t-0 pt-8 lg:pt-0">
              {/* Sidebar nhận dữ liệu khởi tạo từ Server để hiện ngay lập tức */}
              <PostSidebar initialLatest={latest} initialFeatured={featured} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP 2: DANH SÁCH BÀI VIẾT ĐẶC BIỆT (TIN MỚI, TIN NỔI BẬT)
  const isNew = lastSegment === "tin-moi";
  const isFeatured = lastSegment === "tin-noi-bat";

  if (isNew || isFeatured) {
    // TỐI ƯU: Fetch dữ liệu tin mới/nổi bật ở Server
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const { items, pagination } = await getPostsServer(
      `page=1&limit=12&${isNew ? "isNew=true" : "isFeatured=true"}`,
      locale,
      token,
    );

    return (
      <div className=" bg-[#fdfce8] min-h-screen">
        <div className="container mx-auto py-12 px-4">
          <CategoryListContent
            categorySlug={lastSegment}
            categoryCode={""}
            isNew={isNew}
            isFeatured={isFeatured}
            initialData={{ items, pagination }}
          />
        </div>
      </div>
    );
  }

  // TRƯỜNG HỢP 3: DANH SÁCH BÀI VIẾT THEO DANH MỤC
  const categoryCode = await getCategoryCodeByPath(category);

  if (!categoryCode) {
    return notFound();
  }

  // Lấy token từ cookie để kiểm tra bài viết Members Only (phục vụ redirect)
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // TỐI ƯU: Fetch tất cả dữ liệu cần thiết ở Server song song
  const limit = 12;
  const [
    correctCatPath,
    catName,
    { items, pagination },
    { items: latest },
    { items: featured },
  ] = await Promise.all([
    getCategoryPath(categoryCode, locale),
    getCategoryName(categoryCode, locale),
    getPostsServer(
      `category=${categoryCode}&page=1&limit=${limit}`,
      locale,
      token,
    ),
    getPostsServer("page=1&limit=5&isNew=true", locale),
    getPostsServer("page=1&limit=5&isFeatured=true", locale),
  ]);

  // A. REDIRECT NẾU CHỈ CÓ 1 BÀI VIẾT (Áp dụng cho mọi cấp danh mục)
  // Nếu chỉ có đúng 1 bài trong toàn bộ nhánh danh mục này -> Nhảy thẳng vào xem chi tiết
  if (pagination.total === 1 && items.length >= 1) {
    const post = items[0];
    const postLink = getPostLink(post, locale);
    // Manual locale prefixing for next/navigation redirect
    const finalLink = locale === "vi" ? postLink : `/${locale}${postLink}`;
    return redirect(finalLink);
  }

  // B. NORMALIZATION URL DANH MỤC
  const correctCatUrl = `/${correctCatPath.join("/")}`;
  const currentCatUrl = `/${category.join("/")}`;

  if (correctCatPath.length > 0 && correctCatUrl !== currentCatUrl) {
    // Manual locale prefixing for next/navigation redirect
    const finalLink =
      locale === "vi" ? correctCatUrl : `/${locale}${correctCatUrl}`;
    return redirect(finalLink);
  }

  return (
    <div className=" bg-[#fdfce8] min-h-screen">
      <div className="container mx-auto py-8 lg:py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content: 75% */}
          <main className="lg:w-[75%]">
            <CategoryListContent
              categorySlug={lastSegment}
              categoryCode={categoryCode}
              categoryName={catName}
              initialData={{ items, pagination }}
            />
          </main>

          {/* Sidebar: 25% */}
          <div className="lg:w-[25%] border-t lg:border-t-0 pt-8 lg:pt-0">
            <PostSidebar initialLatest={latest} initialFeatured={featured} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalCategoryPage;
