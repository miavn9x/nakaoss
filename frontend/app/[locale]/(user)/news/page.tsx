import PostFeaturePage from "@/features/client/post/page";

export async function generateMetadata() {
  return {
    title: "Tin tức & Sự kiện - Nakao Việt Nam",
    description:
      "Cập nhật các tin tức, sự kiện và dự án mới nhất từ Nakao Việt Nam.",
  };
}

export default function NewsPage() {
  return <PostFeaturePage />;
}
