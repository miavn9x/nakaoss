"use client";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="w-full flex justify-center mb-12">
      <div className="flex border-b border-slate-200 w-full justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-6 pb-3 border-b-2 transition-colors cursor-pointer ${
              activeCategory === cat
                ? "border-naka-blue text-naka-blue hover:bg-slate-50"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <p
              className={`text-xs tracking-widest uppercase font-display ${
                activeCategory === cat ? "font-bold" : "font-medium"
              }`}
            >
              {cat}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
