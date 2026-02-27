import React from "react";
import { specs } from "./productData";

export default function ProductSpecs() {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined" aria-hidden="true">
          straighten
        </span>
        Thông tin cơ bản
      </h3>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <tbody className="bg-white divide-y divide-slate-200">
            {specs.map((spec, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-500 w-1/3 align-top">
                  {spec.label}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {spec.multiline ? (
                    <>
                      Vỏ thân chính: Thép không gỉ
                      <br />
                      Bộ phận bằng nhựa: POM
                    </>
                  ) : (
                    spec.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
