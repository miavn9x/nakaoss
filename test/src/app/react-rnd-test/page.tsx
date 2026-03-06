"use client";

import React, { useState } from "react";
import { BannerPreview } from "./BannerPreview";
import { BannerBg, BannerElement, DeviceType } from "../react-rnd/components/types";

interface ExportData {
      bannerBg: BannerBg;
      bannerHeights: Record<DeviceType, number>;
      elements: BannerElement[];
}

export default function ReactRndTestPage() {
      const [data, setData] = useState<ExportData | null>(null);
      const [device, setDevice] = useState<DeviceType>("desktop");
      const [zoom, setZoom] = useState(1);
      const [error, setError] = useState<string>("");

      const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.name.endsWith(".json")) {
                  setError("Vui lòng tải lên file .json");
                  return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                  try {
                        const jsonContent = event.target?.result as string;
                        const parsedData = JSON.parse(jsonContent);

                        // Basic validation
                        if (!parsedData.bannerHeights || !parsedData.elements) {
                              throw new Error("Cấu trúc file JSON không hợp lệ. Phải chứa bannerHeights và elements.");
                        }

                        setData(parsedData);
                        setError("");
                  } catch (err: unknown) {
                        if (err instanceof Error) {
                              setError(`Lỗi đọc file: ${err.message}`);
                        } else {
                              setError("Lỗi đọc file không xác định");
                        }
                        setData(null);
                  }
            };
            reader.readAsText(file);
      };

      return (
            <div className="min-h-screen bg-slate-100 py-8 font-sans">
                  <div className="container mx-auto space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                              <h1 className="text-2xl font-bold text-slate-800 mb-2">Banner Json Viewer</h1>
                              <p className="text-slate-500 mb-6">Trang mô phỏng hiển thị Banner hoàn toàn bằng HTML/CSS nguyên bản, không dùng thư viện kéo thả.</p>

                              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div className="flex-1">
                                          <label className="block text-sm font-medium text-slate-700 mb-1">Tải file JSON đã Export</label>
                                          <input
                                                type="file"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  transition-colors cursor-pointer"
                                          />
                                          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                                    </div>

                                    {data && (
                                          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                <div className="flex flex-col">
                                                      <label className="text-xs font-semibold text-slate-500 mb-1">Thiết bị</label>
                                                      <select
                                                            value={device}
                                                            onChange={(e) => setDevice(e.target.value as DeviceType)}
                                                            className="text-sm bg-white border border-slate-300 rounded px-2 py-1 outline-indigo-500"
                                                      >
                                                            <option value="desktop">Desktop (2560px)</option>
                                                            <option value="ipad">iPad (768px)</option>
                                                            <option value="mobile">Mobile (375px)</option>
                                                      </select>
                                                </div>

                                                <div className="flex flex-col">
                                                      <label className="text-xs font-semibold text-slate-500 mb-1">Zoom Mô Phỏng</label>
                                                      <div className="flex items-center gap-2">
                                                            <input
                                                                  type="range"
                                                                  min="0.1"
                                                                  max="1"
                                                                  step="0.05"
                                                                  value={zoom}
                                                                  onChange={e => setZoom(parseFloat(e.target.value))}
                                                                  className="w-24 accent-indigo-600"
                                                            />
                                                            <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
                                                      </div>
                                                </div>
                                          </div>
                                    )}
                              </div>
                        </div>

                        {data && (
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto min-h-[500px]">
                                    <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex justify-between">
                                          <span>Kết quả Trình Diễn (Renderer)</span>
                                          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded">Chỉ HTML/CSS CSS tuyệt đối</span>
                                    </h2>
                                    <div className="flex justify-center bg-[url('https://play.tailwindcss.com/img/grid.svg')] border border-slate-200 rounded-lg p-8 overflow-hidden">
                                          <BannerPreview data={data} device={device} zoom={zoom} />
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      );
}
