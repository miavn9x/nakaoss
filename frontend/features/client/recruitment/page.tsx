import { MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function RecruitmentFeaturePage() {
  return (
    <main className="antialiased bg-white text-slate-900 font-display">
      <header className="relative  flex items-center py-20 bg-white overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10 reveal-on-scroll">
            <span className="inline-block text-naka-blue font-bold tracking-[0.3em] uppercase mb-6 text-sm border-b-2 border-naka-blue/20 pb-1 font-display">
              Kỷ nguyên mới
            </span>
            <h1 className="text-6xl md:text-8xl text-naka-blue leading-[1.1] mb-8 font-serif">
              HÀNH TRÌNH
              <br />
              TIẾP NỐI DI SẢN
            </h1>
            <div className="max-w-xl space-y-6 text-lg text-slate-700 leading-relaxed font-display font-light">
              <p className="text-justify text-slate-600">
                Trải qua hơn 100 năm hình thành và khẳng định vị thế trên toàn
                cầu, Nakao đã viết nên những trang sử hào hùng về sự tận tụy và
                tinh hoa kỹ nghệ.
              </p>
              <p className="font-medium italic text-naka-blue text-justify">
                Vào ngày 20/06/2025, Nakao Việt Nam chính thức được thành lập,
                đánh dấu một cột mốc quan trọng trong việc mang những giá trị
                nguyên bản nhất của Nhật Bản đến với thị trường Đông Nam Á.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-4/5 bg-slate-100 overflow-hidden shadow-2xl">
              <img
                alt="Nakao Heritage"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4TUKSlvi_tUVoGLAGwizQ699LmPCes519VNO6HKwNVt7PNsAw9X67nCr3WzBZ63xYdN8oQGoxmbWanG-WXaEn61b_bgk6_uaeCF6rxCd_DTve0u7RGgoR-P7lNyCYjsHPNntPnGNe-wwSoG5KxIqtnimLhz0-D7c6_Jr5Wa-TMEqKA53ITGD2pLZH3iCS1GRYbVcKMaKaeLfO-NVUFAY6Tjf3xhUk4Jc1DdPP37ewkEUfZwTOKUWPUKCduXcJBJjBxfOH7suN6jwj"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-naka-blue p-10 text-white hidden md:block shadow-2xl reveal-on-scroll">
              <p className="text-4xl font-serif italic mb-2">100+</p>
              <p className="text-xs uppercase tracking-widest opacity-80 font-display">
                Năm Kinh Nghiệm
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-32 overflow-hidden bg-[#0f2147] text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            alt="Abstract workspace"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBODyGxC5KAJbqdipK8f-YtIvT3kfDU55OhQb0LblFwpvVuWKdFHpWdJV9Hw8xdVZcTpnQ2JPZfKGVt6mD8EohfwxvtwZ9TxMzInGbnNGPSgTLN-nOvjfyJSOBIlFa3CtFwAq8aeRE7Ig3et69oSyQ-2CsLx2n55reufqwv6-g3307-V9rA36zNtFzQoaoNGUTEViS2JdjEGXAagyiXLBs2OgHGaR-XsKNeONti_ddVRJRIDKFU1mxYMcfA0qzfYvP5AmWzzihgbAHQ"
          />
        </div>
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center reveal-on-scroll">
            <h2 className="text-4xl md:text-6xl mb-12 italic font-serif">
              Tinh thần Monozukuri
            </h2>
            <div className="grid md:grid-cols-2 gap-16 items-start text-left">
              <div className="space-y-6">
                <h3 className="text-2xl text-white/90 uppercase tracking-widest font-serif font-bold">
                  Thử thách & Sáng tạo
                </h3>
                <p className="text-xl leading-relaxed opacity-90 font-display font-light text-justify">
                  Tại Nakao, chúng tôi không chỉ tạo ra sản phẩm; chúng tôi kiến
                  tạo những giải pháp bền vững. Tinh thần 'Monozukuri' là kim
                  chỉ nam cho mọi hoạt động, nơi sự tỉ mỉ trong từng chi tiết
                  nhỏ nhất được đặt lên hàng đầu.
                </p>
              </div>
              <div className="space-y-6 pt-12 md:pt-24 border-t border-white/20">
                <p className="text-lg leading-relaxed opacity-80 italic font-display font-light text-justify">
                  "Chúng tôi tìm kiếm những cộng sự không ngại dấn thân, những
                  người sở hữu tư duy sáng tạo không giới hạn để cùng Nakao định
                  nghĩa lại chuẩn mực của ngành phụ kiện kiến trúc."
                </p>
                <p className="font-bold tracking-widest uppercase text-sm font-display">
                  — Ban lãnh đạo Nakao Việt Nam
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-24 border-b border-slate-200 pb-8 reveal-on-scroll">
            <div>
              <h2 className="text-5xl text-naka-blue mb-4 font-serif">
                Cơ hội Nghề nghiệp
              </h2>
              <p className="text-slate-500 uppercase tracking-widest text-sm font-display">
                Các vị trí đang được tuyển dụng
              </p>
            </div>
          </div>
          <div className="space-y-40 reveal-on-scroll">
            <article className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img
                  alt="Project Sales"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpvdmxLHnPB6vmTOttv7skemNJZqwZufTNe7PrD7cGoNuSu7vIuvDV2TVBWgm6rOJ8qiy_qTmY7pGPBA4ZZPvpXok7PVxBJw2s-n45mR5-qu10yQYe18yAMV5AWIGoxU1twyI5JRIzROU0IqDg-iAbkItbxQ2RVgnhSZ_PEPDAluF8aJcfCcZ5tH167o4Jw874-GJoHJdKJyemY8zJB9-QSA07GKUf35yp2uOMK0x318xu7trWMIWMkoQvap7ACvS__AAIZPCKLpGj"
                />
              </div>
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-naka-blue bg-naka-blue/5 px-3 py-1 font-display">
                  Kinh doanh Dự án
                </span>
                <h3 className="text-4xl text-naka-blue leading-tight font-serif">
                  Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa
                </h3>
                <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                  Đảm nhận vai trò cầu nối giữa kỹ thuật và thương mại, bạn sẽ
                  là người trực tiếp tư vấn các giải pháp tối ưu cho những dự án
                  kiến trúc trọng điểm. Yêu cầu sự hiểu biết sâu sắc về vật liệu
                  và khả năng đàm phán chuyên nghiệp.
                </p>
                <div className="flex gap-8 text-sm font-medium text-slate-500 border-y border-slate-100 py-4">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Hà Nội
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Toàn thời gian
                  </span>
                </div>
                <Link
                  className="inline-block py-4 px-10 bg-naka-blue text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0f2147] transition-colors"
                  href="/vi/recruitment/ky-su-tu-van-giai-phap-phu-kien-cua"
                >
                  Xem chi tiết bài viết
                </Link>
              </div>
            </article>

            <article className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 order-2 lg:order-1">
                <span className="text-xs font-bold uppercase tracking-widest text-naka-blue bg-naka-blue/5 px-3 py-1 font-display">
                  Kỹ thuật & Giám sát
                </span>
                <h3 className="text-4xl text-naka-blue leading-tight font-serif">
                  Chuyên viên Giám sát Kỹ thuật Hiện trường
                </h3>
                <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                  Trực tiếp có mặt tại các công trình lớn để đảm bảo quy trình
                  lắp đặt và vận hành sản phẩm Nakao đạt chuẩn Nhật Bản. Bạn là
                  người bảo chứng cho chất lượng và uy tín của thương hiệu tại
                  công trường.
                </p>
                <div className="flex gap-8 text-sm font-medium text-slate-500 border-y border-slate-100 py-4">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Hà Nội
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Toàn thời gian
                  </span>
                </div>
                <Link
                  className="inline-block py-4 px-10 bg-naka-blue text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0f2147] transition-colors"
                  href="/vi/recruitment/ky-su-tu-van-giai-phap-phu-kien-cua"
                >
                  Xem chi tiết bài viết
                </Link>
              </div>
              <div className="aspect-video bg-slate-100 overflow-hidden order-1 lg:order-2">
                <img
                  alt="Technical Supervisor"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjW_h72Yl6vHDfgPTr34GWyfoxiCkRV3N_OXMJr-ZXg-npd4dVTG6NRbEEtTQkQK0PVB-DJ2xund4f_RvYxCx48-WD0Q1NOB36jqp1dOyLEzbBaH8hxrrHdieVUWrr5meW2nEB19rLdXY5exeD6PN3Fw4hV4eyCT7s1xouWnG4_OqqZmtQINapOnZkKpcj-35ZeeDLP50P0aNkdYYklo2MN8-bMjAASjX0KmjTGDCA5Bv7W61hR2DqEifR-cGfsjOrqZuV9TtzoL1E"
                />
              </div>
            </article>

            <article className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="aspect-video bg-slate-100 overflow-hidden">
                <img
                  alt="Marketing"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsmtFkDchAV3PZKRa9qxyqC1ulWWHbNk5TA-7OR3IX8WK406HQxsYda-n-HpACs19eljWYjQg1TBZQ2eInV9usGNTvO2z_npIjaHfA3OsiQcSuZ_4obnGZrg8VYf84jbq71qi_O48ZaqqpHbgQ0W9C8sE9Fq4CV9ayOHGRyA8EAfkPCkB0w1fWz26rkMe3PVoMeqOe-mJZclhXAZdTkVB1rVNJUcXzvA39ItIMfpiKZJ_R-EXYjssiFPkrE3tCKKxpi7jll8EvfyC_"
                />
              </div>
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-naka-blue bg-naka-blue/5 px-3 py-1 font-display">
                  Marketing
                </span>
                <h3 className="text-4xl text-naka-blue leading-tight font-serif">
                  Brand Executive (B2B Focus)
                </h3>
                <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                  Xây dựng câu chuyện thương hiệu Nakao tại Việt Nam. Tập trung
                  vào các chiến dịch truyền thông B2B hướng tới đối tác kiến
                  trúc sư và nhà thầu, duy trì vị thế cao cấp của thương hiệu
                  trên thị trường.
                </p>
                <div className="flex gap-8 text-sm font-medium text-slate-500 border-y border-slate-100 py-4 font-display">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> TP. HCM
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Toàn thời gian
                  </span>
                </div>
                <Link
                  className="inline-block py-4 px-10 bg-naka-blue text-white font-bold uppercase tracking-widest text-xs hover:bg-[#0f2147] transition-colors"
                  href="/vi/recruitment/ky-su-tu-van-giai-phap-phu-kien-cua"
                >
                  Xem chi tiết bài viết
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-5xl text-naka-blue text-center mb-24 italic font-serif reveal-on-scroll">
            Đãi ngộ & Phát triển
          </h2>
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="space-y-6 reveal-on-scroll">
              <h3 className="text-2xl text-naka-blue font-serif font-bold">
                Đào tạo chuyên sâu tại Nhật
              </h3>
              <div className="w-12 h-1 bg-naka-blue/20"></div>
              <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                Mỗi nhân sự tiềm năng tại Nakao đều có lộ trình đào tạo bài bản.
                Chúng tôi cử các kỹ sư và chuyên viên xuất sắc sang trụ sở chính
                tại Nhật Bản để trực tiếp tiếp thu công nghệ và văn hóa làm việc
                nguyên bản, chuẩn bị cho những bước tiến xa hơn trong sự nghiệp.
              </p>
            </div>
            <div className="space-y-6 reveal-on-scroll">
              <h3 className="text-2xl text-naka-blue font-serif font-bold">
                Môi trường quốc tế
              </h3>
              <div className="w-12 h-1 bg-naka-blue/20"></div>
              <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                Làm việc tại văn phòng hạng A với đội ngũ đa quốc gia. Tại Nakao
                Việt Nam, bạn sẽ được tiếp xúc với những quy chuẩn vận hành khắt
                khe nhất thế giới, đồng thời được khuyến khích đóng góp ý kiến
                cá nhân trong một môi trường tôn trọng sự khác biệt.
              </p>
            </div>
            <div className="space-y-6 reveal-on-scroll">
              <h3 className="text-2xl text-naka-blue font-serif font-bold">
                Đãi ngộ xứng tầm
              </h3>
              <div className="w-12 h-1 bg-naka-blue/20"></div>
              <p className="text-slate-600 leading-relaxed font-display font-light text-justify">
                Chúng tôi hiểu rằng tài năng cần được trân trọng. Chính sách
                lương thưởng tại Nakao luôn nằm trong top đầu ngành, đi kèm với
                các gói bảo hiểm sức khỏe cao cấp và lộ trình thăng tiến minh
                bạch dựa trên hiệu quả công việc thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto space-y-12 reveal-on-scroll">
            <h2 className="text-5xl md:text-7xl text-naka-blue leading-tight font-serif">
              Viết tiếp chương mới
              <br />
              cùng Nakao
            </h2>
            <p className="text-xl text-slate-500 font-display font-light">
              Nếu bạn chưa tìm thấy vị trí phù hợp nhưng tin rằng năng lực của
              mình có thể đóng góp cho sự phát triển của Nakao, đừng ngần ngại
              chia sẻ hồ sơ với chúng tôi.
            </p>
            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="w-full md:w-auto px-16 py-6 bg-naka-blue text-white text-xs font-bold font-display uppercase tracking-[0.2em] hover:bg-naka-blue/90 transition-all shadow-xl cursor-pointer">
                liên hệ tuyển dụng
              </button>
              {/* <a
                  className="text-naka-blue font-bold uppercase tracking-widest text-xs border-b border-naka-blue pb-1 hover:text-[#2a4e91] transition-colors"
                  href="#"
                >
                  Tìm hiểu thêm về chúng tôi
                </a> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
