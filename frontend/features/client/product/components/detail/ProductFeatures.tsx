import React from "react";
import { features, usageTerms } from "./productData";

export default function ProductFeatures() {
  return (
    <div className="space-y-6">
      {/* Feature List */}
      <div>
        <h3 className="text-lg font-serif font-bold text-naka-blue mb-3">
          Tính năng sản phẩm
        </h3>
        <p className="text-slate-600 leading-relaxed mb-3 font-display font-light text-justify">
          Bộ giảm chấn tương thích với ray rộng 28mm. Chất lượng cao đạt được
          nhờ năm cải tiến về hiệu suất.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm leading-relaxed font-display">
          {features.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ol>
      </div>

      {/* Usage Terms Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <span
            className="material-symbols-outlined text-naka-blue text-3xl mt-1"
            aria-hidden="true"
          >
            door_sliding
          </span>
          <div>
            <h4 className="text-base font-serif font-bold text-naka-blue mb-2">
              Điều khoản sử dụng
            </h4>
            <ul className="text-sm text-slate-600 space-y-1 font-display font-light">
              {usageTerms.map((term, i) => (
                <li key={i}>• {term}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
