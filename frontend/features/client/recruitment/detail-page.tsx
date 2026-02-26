import {
    Calendar,
    Building2,
    MapPin,
    CheckCircle2,
    GraduationCap,
    Brain,
    Banknote,
    ShieldCheck,
    PlaneTakeoff,
    Award,
    Upload,
    Send
} from "lucide-react";

export default function RecruitmentDetailFeaturePage() {
    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
      `,
                }}
            />
            <div className="relative flex min-h-screen flex-col items-center bg-white text-slate-900 font-sans">
                <main className="w-full max-w-7xl px-6 py-12 flex flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-[#1152d4]/10 text-[#1152d4] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Kỹ Thuật / Kinh Doanh
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Toàn thời gian
                            </span>
                        </div>
                        <h1 className="text-[#0f172a] text-4xl md:text-5xl font-black leading-tight tracking-tight">
                            Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa
                        </h1>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-500 text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-5 h-5" />
                                <span>Đăng ngày: 24/10/2023</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-5 h-5" />
                                <span>Bộ phận Kinh doanh Dự án</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-5 h-5" />
                                <span>Tòa nhà VIT, Hà Nội</span>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-200">
                        <img
                            className="w-full h-full object-cover"
                            alt="Modern office interior"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4TUKSlvi_tUVoGLAGwizQ699LmPCes519VNO6HKwNVt7PNsAw9X67nCr3WzBZ63xYdN8oQGoxmbWanG-WXaEn61b_bgk6_uaeCF6rxCd_DTve0u7RGgoR-P7lNyCYjsHPNntPnGNe-wwSoG5KxIqtnimLhz0-D7c6_Jr5Wa-TMEqKA53ITGD2pLZH3iCS1GRYbVcKMaKaeLfO-NVUFAY6Tjf3xhUk4Jc1DdPP37ewkEUfZwTOKUWPUKCduXcJBJjBxfOH7suN6jwj"
                        />
                    </div>

                    <article className="prose prose-slate max-w-none">
                        <section>
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-4 border-l-4 border-[#1152d4] pl-4">
                                Về Nakao Việt Nam và Tầm nhìn 100 năm
                            </h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Nakao tự hào là thương hiệu hàng đầu trong lĩnh vực phụ kiện cửa cao cấp, với bề dày lịch sử phát triển bền vững. Chúng tôi không chỉ cung cấp sản phẩm, mà còn kiến tạo những giải pháp an toàn và thẩm mỹ cho mọi công trình kiến trúc tại Việt Nam.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                Với "Tầm nhìn 100 năm", Nakao cam kết xây dựng một đội ngũ nhân sự chuyên nghiệp, lấy sự hài lòng của khách hàng làm trọng tâm và không ngừng đổi mới công nghệ để dẫn đầu thị trường khu vực Đông Nam Á.
                            </p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Mô tả công việc chi tiết</h2>
                            <ul className="space-y-4 text-slate-700 list-none p-0">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-[#1152d4] shrink-0 mt-0.5" />
                                    <span>Tư vấn kỹ thuật và đưa ra giải pháp phụ kiện cửa tối ưu cho các dự án chung cư cao cấp, khách sạn và cao ốc văn phòng.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-[#1152d4] shrink-0 mt-0.5" />
                                    <span>Phối hợp cùng các đơn vị thiết kế, nhà thầu để bóc tách khối lượng và lập bảng dự toán kỹ thuật.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-[#1152d4] shrink-0 mt-0.5" />
                                    <span>Hỗ trợ đội ngũ kinh doanh trong việc đàm phán các yêu cầu kỹ thuật đặc thù của khách hàng.</span>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-[#1152d4] shrink-0 mt-0.5" />
                                    <span>Giám sát quy trình lắp đặt mẫu tại công trường và đào tạo kỹ thuật cho đối tác thi công.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Yêu cầu ứng viên</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-[#1152d4]" /> Kỹ năng & Kinh nghiệm
                                    </h3>
                                    <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
                                        <li>Tốt nghiệp Đại học chuyên ngành Xây dựng, Kiến trúc hoặc Cơ khí.</li>
                                        <li>Ít nhất 2 năm kinh nghiệm tại vị trí tương đương.</li>
                                        <li>Sử dụng thành thạo AutoCAD và các phần mềm văn phòng.</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-[#1152d4]" /> Thái độ & Tố chất
                                    </h3>
                                    <ul className="text-sm space-y-2 text-slate-600 list-disc pl-4">
                                        <li>Tư duy giải quyết vấn đề linh hoạt và sáng tạo.</li>
                                        <li>Khả năng làm việc độc lập và chịu áp lực cao.</li>
                                        <li>Trung thực, tận tâm và có tinh thần trách nhiệm.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Quyền lợi & Chế độ đãi ngộ</h2>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-[#1152d4]/5 px-4 py-2 rounded-lg border border-[#1152d4]/20">
                                    <Banknote className="w-5 h-5 text-[#1152d4]" />
                                    <span className="font-medium text-sm">Lương thưởng cạnh tranh</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#1152d4]/5 px-4 py-2 rounded-lg border border-[#1152d4]/20">
                                    <ShieldCheck className="w-5 h-5 text-[#1152d4]" />
                                    <span className="font-medium text-sm">Bảo hiểm toàn diện</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#1152d4]/5 px-4 py-2 rounded-lg border border-[#1152d4]/20">
                                    <PlaneTakeoff className="w-5 h-5 text-[#1152d4]" />
                                    <span className="font-medium text-sm">Du lịch hàng năm</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#1152d4]/5 px-4 py-2 rounded-lg border border-[#1152d4]/20">
                                    <Award className="w-5 h-5 text-[#1152d4]" />
                                    <span className="font-medium text-sm">Thưởng quý & KPI</span>
                                </div>
                            </div>
                        </section>
                    </article>

                    <section className="mt-12 py-10 border-t border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">Quy trình tuyển dụng</h2>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                            <div className="hidden md:block absolute top-[24px] left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

                            <div className="flex flex-col items-center text-center gap-3 bg-white px-4">
                                <div className="w-12 h-12 rounded-full bg-[#1152d4] text-white flex items-center justify-center font-bold shadow-lg shadow-[#1152d4]/20">
                                    1
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Nộp hồ sơ</p>
                                    <p className="text-xs text-slate-500">CV & Portfolio</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center gap-3 bg-white px-4">
                                <div className="w-12 h-12 rounded-full bg-[#1152d4] text-white flex items-center justify-center font-bold shadow-lg shadow-[#1152d4]/20">
                                    2
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Sơ loại</p>
                                    <p className="text-xs text-slate-500">Phỏng vấn qua điện thoại</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center gap-3 bg-white px-4">
                                <div className="w-12 h-12 rounded-full bg-[#1152d4] text-white flex items-center justify-center font-bold shadow-lg shadow-[#1152d4]/20">
                                    3
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Phỏng vấn</p>
                                    <p className="text-xs text-slate-500">Gặp mặt trực tiếp</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center gap-3 bg-white px-4">
                                <div className="w-12 h-12 rounded-full bg-[#1152d4] text-white flex items-center justify-center font-bold shadow-lg shadow-[#1152d4]/20">
                                    4
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Thử việc</p>
                                    <p className="text-xs text-slate-500">Bắt đầu hành trình</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100" id="apply-form">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Ứng tuyển nhanh</h2>
                            <p className="text-slate-600">Vui lòng điền thông tin bên dưới để bộ phận Tuyển dụng liên hệ với bạn.</p>
                        </div>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold mb-2 text-slate-900">Họ và tên *</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 bg-white focus:ring-[#1152d4] focus:border-[#1152d4] outline-none"
                                    placeholder="Nguyễn Văn A"
                                    type="text"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-semibold mb-2 text-slate-900">Số điện thoại *</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 bg-white focus:ring-[#1152d4] focus:border-[#1152d4] outline-none"
                                    placeholder="0901 234 567"
                                    type="tel"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-900">Email *</label>
                                <input
                                    className="w-full px-4 py-3 rounded-lg border-slate-200 bg-white focus:ring-[#1152d4] focus:border-[#1152d4] outline-none"
                                    placeholder="email@example.com"
                                    type="email"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-slate-900">Tải hồ sơ / CV (.pdf, .docx) *</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-slate-100 transition-colors cursor-pointer">
                                    <Upload className="w-10 h-10 text-slate-400 mb-2" />
                                    <p className="text-sm font-medium text-slate-600">Kéo thả hoặc Nhấp để tải file</p>
                                    <p className="text-xs text-slate-400 mt-1">Dung lượng tối đa 10MB</p>
                                </div>
                            </div>
                            <div className="col-span-2 mt-2">
                                <button
                                    className="w-full bg-[#1152d4] hover:bg-[#1152d4]/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#1152d4]/20 flex items-center justify-center gap-2"
                                    type="button"
                                >
                                    GỬI HỒ SƠ NGAY
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </>
    );
}
