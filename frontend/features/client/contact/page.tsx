import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  PenTool,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  return {
    title: "Liên Hệ - Nakao Việt Nam",
    description:
      "Chúng tôi sẵn sàng hỗ trợ tư vấn giải pháp kỹ thuật và báo giá dự án cho doanh nghiệp của bạn.",
    keywords:
      "Liên hệ Nakao, Nakao Việt Nam, Phụ kiện cửa Nakao, Báo giá dự án Nakao",
    openGraph: {
      title: "Liên Hệ - Nakao Việt Nam",
      description:
        "Chúng tôi sẵn sàng hỗ trợ tư vấn giải pháp kỹ thuật và báo giá dự án cho doanh nghiệp của bạn.",
      type: "website",
      url: `https://nakaoss.com/${locale}/contact`,
      images: [
        {
          url: "/banner/melatoslide.jpg",
          width: 1200,
          height: 630,
          alt: "Liên Hệ - Nakao Việt Nam",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Liên Hệ - Nakao Việt Nam",
      description:
        "Chúng tôi sẵn sàng hỗ trợ tư vấn giải pháp kỹ thuật và báo giá dự án cho doanh nghiệp của bạn.",
      images: ["/banner/melatoslide.jpg"],
    },
    alternates: {
      canonical: `https://nakaoss.com/${locale}/contact`,
    },
  };
}

export default async function ContactFeaturePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .contact-hero-bg {
              background-image: linear-gradient(rgba(19, 23, 31, 0.7), rgba(29, 59, 119, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-843n6M9fN4vYXoedNKOxBf4tIBE0n65ZLi9HIIuS-huvZD-4cLJdoxl1_gdFz1d4fUJ4apQisM4cK_5CDRLK4XIPzJ7krQXvE_4m9T48e9sHGJCAHhudMmSk3zcF4uHnw6FG2184MQ1SeGzYCJv25HE1eHXwWK1ZOBBHueZE4GrFRo0iFqKoWlXJG-GMLqkyIKywNlvgxpevOYMk7tV8xWRho_HvstKKVJVXTd1An1AH1o36iXtL3P-YG7rE384gPxdxW4QbFQXw');
              background-size: cover;
              background-position: center;
            }
            .contact-map-bg {
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPQCSTIGE7jqLoSBojzGiSzJ7q4X-rczaf5ROlEPJmPkRRK_rOW8AmQXZiH5XE4NydyV2M2EJtmbNXetp5R6tdkZ3iZWoHHdIbdKC5A6aRQajl6NwM5b9z3BiGvlhm4vgwmnBNyk4FEGsVP6VMZ7Ma5Tlkg4BZWZJyJWTZ2U2M_OdaHv3Ln2TzLx9v0ObPd1wJE82ajOHz4aZZCvhn4xXBJgzL28nMmTNLfOQZ2H4pNE3GBFOkYqmqRBSFyOnSBpJPk-Chv2rWZ9O9');
              background-size: cover;
              background-position: center;
            }
            .contact-grid-bg {
              background-image: linear-gradient(rgba(29, 59, 119, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(29, 59, 119, 0.03) 1px, transparent 1px);
              background-size: 40px 40px;
            }
            .contact-pattern-bg {
              background-image: linear-gradient(45deg, #ffffff 1px, transparent 1px);
              background-size: 30px 30px;
            }
          `,
        }}
      />
      <main className="pb-8 relative bg-[#f6f7f8] font-display text-slate-900 min-h-screen flex flex-col">
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden contact-hero-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              LIÊN HỆ VỚI NAKAO VIỆT NAM
            </h1>
            <p className="text-slate-200 text-lg sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
              Chúng tôi sẵn sàng hỗ trợ tư vấn giải pháp kỹ thuật và báo giá dự
              án cho doanh nghiệp của bạn.
            </p>
          </div>
        </div>

        <div className="grow container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20 relative z-20">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-2/5 bg-slate-50 p-8 lg:p-12 border-r border-slate-100">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Thông tin liên hệ & Tư vấn
                </h3>
                <p className="text-slate-500">
                  Vui lòng điền thông tin hoặc liên hệ trực tiếp văn phòng đại
                  diện.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-naka-blue/10 flex items-center justify-center shrink-0 text-naka-blue">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-base font-medium text-slate-900 leading-snug">
                      Tòa nhà VIT, 519 Kim Mã, Ngọc Khánh, Ba Đình, Hà Nội
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-naka-blue/10 flex items-center justify-center shrink-0 text-naka-blue">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Hotline
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      0984 872 828
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-naka-blue/10 flex items-center justify-center shrink-0 text-naka-blue">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      Email
                    </p>
                    <p className="text-base font-medium text-slate-900">
                      inquiry_vn@nakaoss.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-lg overflow-hidden h-48 w-full bg-slate-200 relative">
                <div className="absolute inset-0 contact-map-bg"></div>
              </div>
            </div>

            <div className="lg:w-3/5 p-8 lg:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Họ và tên <span className="text-red-500">*</span>
                    </span>
                    <input
                      className="form-input mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-[#1d3b77] focus:ring focus:ring-[#1d3b77]/20 transition-all py-3 px-4"
                      placeholder="Nguyễn Văn A"
                      type="text"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Tên doanh nghiệp <span className="text-red-500">*</span>
                    </span>
                    <input
                      className="form-input mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-[#1d3b77] focus:ring focus:ring-[#1d3b77]/20 transition-all py-3 px-4"
                      placeholder="Công ty TNHH ABC"
                      type="text"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </span>
                    <input
                      className="form-input mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-[#1d3b77] focus:ring focus:ring-[#1d3b77]/20 transition-all py-3 px-4"
                      placeholder="example@company.com"
                      type="email"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Số điện thoại
                    </span>
                    <input
                      className="form-input mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-[#1d3b77] focus:ring focus:ring-[#1d3b77]/20 transition-all py-3 px-4"
                      placeholder="09xxxxxxx"
                      type="tel"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Sản phẩm quan tâm
                    </span>
                    <select className="form-select mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-naka-blue focus:ring focus:ring-naka-blue/20 transition-all py-3 px-4 text-slate-600">
                      <option>Vui lòng chọn</option>
                      <option>Bản lề</option>
                      <option>Ray trượt</option>
                      <option>Tay nắm</option>
                      <option>Phụ kiện cửa trượt</option>
                      <option>Khác</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-700 font-medium mb-2 block">
                      Lĩnh vực hoạt động
                    </span>
                    <select className="form-select mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-naka-blue focus:ring focus:ring-naka-blue/20 transition-all py-3 px-4 text-slate-600">
                      <option>Vui lòng chọn</option>
                      <option>Nhà thầu thi công</option>
                      <option>Kiến trúc sư / Thiết kế</option>
                      <option>Đại lý phân phối</option>
                      <option>Xưởng sản xuất nội thất</option>
                      <option>Khác</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-slate-700 font-medium mb-2 block">
                    Nội dung mong muốn
                  </span>
                  <textarea
                    className="form-textarea mt-1 block w-full rounded-lg border-slate-300 bg-white focus:border-naka-blue focus:ring focus:ring-naka-blue/20 transition-all py-3 px-4 h-32"
                    placeholder="Vui lòng mô tả yêu cầu của bạn..."
                  ></textarea>
                </label>

                <div className="pt-4">
                  <button
                    className="w-full bg-naka-blue hover:bg-naka-blue/90 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                    type="button"
                  >
                    <span>GỬI THÔNG TIN - NAKAO SẼ LIÊN HỆ NGAY</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-stone-50/50 py-24 relative contact-grid-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
              <div className="max-w-xl">
                <span className="text-naka-blue font-mono text-sm tracking-widest uppercase mb-2 block opacity-80">
                  Nakao B2B Services
                </span>
                <h2 className="text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-tight relative inline-block pb-4 after:content-[''] after:absolute after:left-0 after:bottom-[-8px] after:w-10 after:h-0.5 after:bg-naka-blue">
                  Hỗ trợ{" "}
                  <strong className="font-bold text-naka-blue">
                    B2B chuyên sâu
                  </strong>
                </h2>
              </div>
              <p className="text-slate-500 max-w-md text-base font-light leading-relaxed md:text-right">
                Đồng hành cùng sự phát triển bền vững của doanh nghiệp thông qua
                các dịch vụ hỗ trợ kỹ thuật và thương mại chất lượng Nhật Bản.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-7 bg-white p-10 rounded-none border-l-4 border-naka-blue shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 cursor-default">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-naka-blue/5 transition-colors">
                      <PenTool
                        className="w-9 h-9 text-naka-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="font-mono text-slate-300 text-sm">01</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-naka-blue mb-4 transition-colors">
                      Tư vấn giải pháp kỹ thuật
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg font-light">
                      Đội ngũ kỹ sư Nakao với kinh nghiệm chuyên sâu sẵn sàng
                      phân tích bản vẽ, giải đáp thắc mắc và đề xuất phương án
                      thi công tối ưu nhất cho từng hạng mục công trình.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center text-naka-blue text-sm font-semibold tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Chi tiết dịch vụ <ArrowUpRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-10 rounded-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group hover:-translate-y-1 cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-naka-blue/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500 ease-out"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-naka-blue/5 transition-colors">
                      <BookOpen
                        className="w-9 h-9 text-naka-blue"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="font-mono text-slate-300 text-sm">02</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Gửi Catalogue tận nơi
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-auto">
                    Cung cấp trọn bộ tài liệu kỹ thuật, catalogue in ấn chất
                    lượng cao và mẫu vật liệu mới nhất trực tiếp đến văn phòng
                    của bạn để thuận tiện cho việc trình mẫu.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-12 bg-naka-blue text-white p-10 rounded-none shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none contact-pattern-bg"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3 opacity-90">
                      <span className="font-mono text-sm border border-white/30 px-2 py-0.5 rounded">
                        03
                      </span>
                      <span className="uppercase tracking-widest text-sm font-medium">
                        Đối tác dự án
                      </span>
                    </div>
                    <h3 className="text-3xl font-light mb-2">
                      Yêu cầu báo giá dự án
                    </h3>
                    <p className="text-white/80 font-light text-lg max-w-2xl">
                      Chính sách giá đặc biệt dành riêng cho B2B với cam kết
                      phản hồi báo giá nhanh chóng, chính xác theo khối lượng và
                      yêu cầu kỹ thuật.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/10 group-hover:bg-white group-hover:text-naka-blue transition-all duration-300 cursor-pointer">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
