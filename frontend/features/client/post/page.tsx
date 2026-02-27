"use client";

import { useState } from "react";
import FeaturedPost from "./components/FeaturedPost";
import PostListItem from "./components/PostListItem";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";

const MOCK_POSTS = [
  {
    id: "1",
    title:
      "Lễ thành lập Công ty TNHH Nakao Việt Nam - Dấu ấn 100 năm phát triển bền vững",
    description:
      "Nakao chính thức hiện diện tại Việt Nam với văn phòng mới tại tòa nhà VIT, đánh dấu bước ngoặt chiến lược trong việc cung cấp các giải pháp bản lề cao cấp và phụ kiện cửa chất lượng Nhật Bản cho thị trường Đông Nam Á. Sự kiện cũng là dịp để nhìn lại hành trình 100 năm kiến tạo những giá trị bền vững.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3duGqViKmYqjFCdom8m89XAb6Wc9mp3xxe3RDkUMTKlTW_fwgu61abevHA9owz_HlhCAEFHUQUJuSDgPaD81FNJ7K_rTKIb9ztL3WRSRZLIrknUQTFgdz3VlPzDyKmamYdOuxgIsJsNA87m93lzQxy73kJtfuJrkCzlKQauR3PN5o0rx-iWdd4uweRAp-VS5j2Vu8mpz-KQ_viopap81Cv5EG29KBx_empYTAxOpkUiRwxAyF5TwxMh2KouIYsY336RGcH6TrHBt",
    category: "Tiêu điểm",
    date: "20/06/2025",
    slug: "le-thanh-lap-nakao-viet-nam",
  },
  {
    id: "2",
    title: "Nakao tham dự Triển lãm Quốc tế Vietbuild 2025",
    description:
      "Giới thiệu các dòng sản phẩm bản lề thủy lực mới nhất với công nghệ đóng mở êm ái, thu hút sự quan tâm của hàng nghìn khách tham quan và đối tác chiến lược trong ngành xây dựng.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmbrgGdOAfwnrPbEM8-H-xxotnMHaN1z8-P6JYoRuJRhVgTI1yyw9hJYm5Cr4wRq-m1m_Yy3DRPyN1Zj9NQH_VW7lzvTkjOLqgUbWkjW7i1oPCCHWIDp_Q-4xPRjNk2Mn88bguelyLEAsiZ1ozC5wQ2XTqKEE2uFZrsgza2pHoV_6ay0ZLe8CvVsTgE_ULehEsEDUswDiY5u4nrR6hbg9ou7pLJCK9ePH_4dilNq5_3vFlXHNDCU8lGqZIVjOpQquoBZIylgTKsKuv",
    category: "Sự kiện",
    date: "15/05/2025",
    slug: "nakao-vietbuild-2025",
  },
  {
    id: "3",
    title: "Đột phá công nghệ với dòng Bản lề 3D Hinge thế hệ mới",
    description:
      "Khám phá khả năng điều chỉnh ba chiều linh hoạt, giúp việc lắp đặt cửa trở nên chính xác và dễ dàng hơn bao giờ hết, đáp ứng tiêu chuẩn khắt khe của các công trình cao cấp.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFOGx7FqPx1dIZwxHBqZWVLtXOAaaK9zseeP6686bYZUBivIx3XnWIaKr4OG19Lnc6Ovn6bZ2l6tmkt8iJyjhl5X8Kt4fwPTFY-Xn09Z6erM4OckJ_9mCiCnNhnInPkmPvZhyBLXa0ahx5KuLDre--IyWotKNUgLAQYMMa6BWzTSQxsBXFYH3Irnt7i67Pau3GVbP4J-51p4l9RH_O0qJXuGxzy4Ykg09jCjUwzPL_D2lG7WG05Fr7hLDkuzM7mCxeN51V9IsJ9dt1",
    category: "Kỹ thuật",
    date: "02/04/2025",
    slug: "ban-le-3d-hinge",
  },
  {
    id: "4",
    title: "Nakao cung cấp giải pháp phụ kiện cho Tòa nhà Landmark 81",
    description:
      "Nakao vinh dự được lựa chọn là nhà cung cấp hệ thống bản lề cửa chống cháy cho dự án biểu tượng của Việt Nam, khẳng định uy tín và chất lượng sản phẩm trên thị trường quốc tế.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGXIFjcmCXPGajlne4uPs2mpuNLDxPhSL9gOq14J5xWm6zf0JN4HzUDKe_EKzmdxx8aoMaICSJnzMhKNXw23sO9TBqcCZ_LUGwC0KFAm6FSaqHS0K1UzMqy58xSxI0LYTjihjliceZLc4TXhe_mJW-dqIouKgJqnGQMJqmS5Iv1q3xynEXWeBjcbyZ-TiBFL7uq8zaT-J9j3jdinRUXKXPIz1Yx1NS5G8mvZ3vDvOclZM19wPDv3JfHM1x58exVXthADIvwFL3vYqK",
    category: "Dự án",
    date: "10/03/2025",
    slug: "nakao-landmark-81",
  },
  {
    id: "5",
    title: "Chương trình đào tạo chuyên sâu về tiêu chuẩn JIS Nhật Bản",
    description:
      "Chương trình đào tạo nội bộ thường niên nhằm nâng cao kiến thức về các tiêu chuẩn công nghiệp Nhật Bản (JIS) áp dụng trong quy trình sản xuất và kiểm định chất lượng tại nhà máy Nakao.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLSkcMIzZFk3qFs7fIJnUWFdgQsCBiBGxxvzbTiCBZool8P2EUFS8lny27yW3vwRHaYR6_-x7JiDUelierDrWA8qQAYyPIwIwuEZQAeB9fn_s8G-2e2mf6cSL0NRKXX33mTFS48OlrP3N6yWCoOPQhG9r2Wac7ukcYdDV20m6mQt49gnUWsW-Yr1jLfgrGcyRobCIpGtSAmllHEQvDSHGbMnUHDW4b8Lq8ytX9ecUrfEVtgxOODbm2YLh98DpWu1eGGdzWGPQmPyHs",
    category: "Tin tức Nakao",
    date: "28/02/2025",
    slug: "dao-tao-tieu-chuan-jis",
  },
];

const CATEGORIES = ["Tất cả", "Tin tức Nakao", "Sự kiện", "Kỹ thuật", "Dự án"];

export default function PostFeaturePage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts =
    activeCategory === "Tất cả"
      ? MOCK_POSTS
      : MOCK_POSTS.filter((post) => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .post-hero-bg {
              background-image: linear-gradient(rgba(19, 23, 31, 0.7), rgba(29, 59, 119, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZ3duGqViKmYqjFCdom8m89XAb6Wc9mp3xxe3RDkUMTKlTW_fwgu61abevHA9owz_HlhCAEFHUQUJuSDgPaD81FNJ7K_rTKIb9ztL3WRSRZLIrknUQTFgdz3VlPzDyKmamYdOuxgIsJsNA87m93lzQxy73kJtfuJrkCzlKQauR3PN5o0rx-iWdd4uweRAp-VS5j2Vu8mpz-KQ_viopap81Cv5EG29KBx_empYTAxOpkUiRwxAyF5TwxMh2KouIYsY336RGcH6TrHBt');
              background-size: cover;
              background-position: center;
            }
          `,
        }}
      />

      {/* Banner Section */}
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden post-hero-bg">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10 reveal-on-scroll">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif font-black mb-6 tracking-tight uppercase leading-[1.3]">
            Tin tức & Sự kiện
          </h1>
          <p className="text-slate-200 text-base md:text-xl font-display font-light max-w-2xl mx-auto leading-relaxed">
            Thông tin chính thức về hoạt động kinh doanh, sự kiện doanh nghiệp
            và các dự án tiêu biểu của Nakao Việt Nam.
          </p>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16 reveal-on-scroll">
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setCurrentPage(1);
          }}
        />

        <div className="flex flex-col gap-10">
          {featuredPost && <FeaturedPost post={featuredPost} />}

          <div className="grid grid-cols-1 gap-10">
            {listPosts.map((post) => (
              <PostListItem key={post.id} post={post} />
            ))}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
