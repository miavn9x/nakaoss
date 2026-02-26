"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center mt-12 pt-8 border-t border-slate-100">
      <nav className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm hover:text-naka-blue"
        >
          <span className="material-symbols-outlined text-sm">west</span>
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center transition-colors text-sm ${
                currentPage === page
                  ? "bg-naka-blue text-white font-bold"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-naka-blue"
              }`}
            >
              {page}
            </button>
          );
        })}

        {totalPages > 3 && (
          <span className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">
            ...
          </span>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm hover:text-naka-blue"
        >
          <span className="material-symbols-outlined text-sm">east</span>
        </button>
      </nav>
    </div>
  );
}
