"use client";

import Link from "next/link";

interface FeaturedPostProps {
  post: {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    date: string;
    slug: string;
  };
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="group relative flex flex-col bg-white mb-8 pb-8 border-b border-slate-200">
      <div className="aspect-video w-full overflow-hidden mb-6 bg-slate-100">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-xs font-bold text-naka-blue uppercase tracking-wider font-display border border-naka-blue/20 px-2 py-0.5">
            {post.category}
          </span>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wide font-display">
            {post.date}
          </span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 font-serif leading-tight group-hover:text-naka-blue transition-colors">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-slate-600 text-base leading-relaxed mb-4 line-clamp-3">
          {post.description}
        </p>
        <Link
          href={`/news/${post.slug}`}
          className="inline-flex items-center gap-2 text-naka-blue font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all mt-2"
        >
          Xem chi tiết{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}
