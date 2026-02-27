"use client";

import React, { useEffect } from "react";
import AdvantageHero from "./components/AdvantageHero";
import AdvantageVideoLibrary from "./components/AdvantageVideoLibrary";
import AdvantagePhilosophy from "./components/AdvantagePhilosophy";
import VideoModal from "./components/VideoModal";

export default function AdvantagePage() {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-white text-gray-800 antialiased font-display">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .technical-line {
            height: 1px;
            background: linear-gradient(90deg, #1d3b78 0%, rgba(29, 59, 119, 0) 100%);
        }
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .btn-tech-hover {
            position: relative;
            overflow: hidden;
            transition: color 0.3s ease;
        }
        .btn-tech-hover:hover {
            color: #1d3b78;
        }
        .btn-tech-hover::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #1d3b78;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s ease-out;
        }
        .btn-tech-hover:hover::after {
            transform: scaleX(1);
            transform-origin: left;
        }
        .play-btn-pulse {
            animation: pulse-border 2s infinite;
        }
        @keyframes pulse-border {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
        }
        .video-thumb-1 { background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAixcOmvtCLj5Ie7oh6-sSIYdx5zICQczEk3sDP07i0EyfSPXKAcT21oBT8HqbbroswkxbR_tQulS1UB1X3Y2eQzNBMcD2o1MM5nZTrpk53tIXlMB70zvdca-eFt6gq9FAJt84NPA_g2sNahQj1ahJoVTXghVEc08WWhkLw6BnrbhoRk9WTPln_IQsW0fUYgY5I1lE_wZoQkssa3T2EgfmULl8NHPR_OgFaS5996FW91GfK1T8pTVr5QbWiyMdkUe1z--ZdrZSfMuzD'); }
        .video-thumb-2 { background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBBnji9vURYSRadozlA_kvSiTGJkV086yReeJO-euzbyIRpkrgUNwNIEf0SZ8aAJsgsMgWGji1OxLUz92zLJjyht9oBwkdlYw9F82aCg6zK8575Lwf3oYYEPmxklhxu7y7FsqYRvSVgSlHxMfUXtjKVlN1XGtX5FLuGj6VzYOwN2sU9MM3A_-HhC_3h28WSu4Ul3O4kcj4uZfyaghNOGFF_w3lQuBeBzxXvZKccI0Wl2I57ZYr7j1FJ8fMDdzmi3iPmW1dK3upmCav'); }
        .video-thumb-3 { background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6khgHCRaFKxDayqulpiItLW79mhxttoyJVc_q0iRtus3YReNhvrpTcSXlpX3uQ9WoHdDZRQGhhah2-m2eRuuDSZMNGTZZoECTbx7Nvjow4SCfC_xcXuqZbbSWFchmhioThenK0qeGXgmT4n83kvsRVPny17VBI4svabtpaToV06h4Hm5drhcUDJsmkbn61f0J8Cvs0JLlu_4KLuBXgHXkfBJ_8BvFX_IINK5PvA9Ee7xFmIYKTe1DdxhyCte67FlERR13-a2gZLvb'); }
        .video-thumb-4 { background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiJPL0aE_bXxD8R-eOd4WuLPMdr1XWSeH4UP0g57mBQFssPl-wsUpY0-eVeV6YSki9yWONTgr6-85jdIJJUnOsGpbOD87_6hEAI4MXd2D5XI-pzSeiovNDsVIIQ1chOgDGEDoykuohtM63u2v2uX3ttlcF4GD3hiAsJuH1DaBw7iffpJNz2ke1m2vI2sKcSYLxevdqGqxUdN3SVgkvSlou8RdvUQVxWVwhfz9ffW4ipvZJrbnOVjSrR4uRzArZ6xlrs9ZnHJftowRQ'); }
        .hero-thumb { background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9s8Pr5wMDTOtRQshFtEqa6iffPdqY3qa3BzmM381-qS2mBBmRjnuQgp8OxG2kYCHxu5LUN1YGAN6s49K2tTgnJNWu1K6YQuhHhaT79eIJjWWXH-6lhOQLD-zscC5f5R53fBoc0tMG-86_4c1zY_ytOQ4T9hvePK8E-4nSq5yl6Z3WYFl4oxTyaGuEQXzh7YDDYHBfbSpjUDi1giE3gMHdPzMGyLew1JimrqsEXnt2dFhiPUEOg4dukndlxGPVj0DbqK9bMDE5d3tI'); }
        .advantage-hero-bg {
            background-image: linear-gradient(rgba(19, 23, 31, 0.7), rgba(29, 59, 119, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9s8Pr5wMDTOtRQshFtEqa6iffPdqY3qa3BzmM381-qS2mBBmRjnuQgp8OxG2kYCHxu5LUN1YGAN6s49K2tTgnJNWu1K6YQuhHhaT79eIJjWWXH-6lhOQLD-zscC5f5R53fBoc0tMG-86_4c1zY_ytOQ4T9hvePK8E-4nSq5yl6Z3WYFl4oxTyaGuEQXzh7YDDYHBfbSpjUDi1giE3gMHdPzMGyLew1JimrqsEXnt2dFhiPUEOg4dukndlxGPVj0DbqK9bMDE5d3tI');
            background-size: cover;
            background-position: center;
        }
      `,
        }}
      />
      <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden advantage-hero-bg">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10 reveal-on-scroll">
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif font-black mb-6 tracking-tight uppercase leading-[1.3]">
              LỢI THẾ ĐỘC QUYỀN <br className="hidden md:block" />& CÔNG NGHỆ
              NAKAO
            </h1>
            <p className="text-slate-200 text-base md:text-xl font-display font-light max-w-2xl mx-auto leading-relaxed">
              Khám phá sự tinh hoa trong từng chi tiết kỹ thuật và vận hành từ
              Nhật Bản qua những thước phim minh chứng chân thực.
            </p>
          </div>
        </div>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
          <AdvantageHero onPlay={(url) => setSelectedVideo(url)} />
          <AdvantageVideoLibrary onPlay={(url) => setSelectedVideo(url)} />
          <AdvantagePhilosophy />
        </main>

        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo || ""}
        />
      </div>
    </div>
  );
}
