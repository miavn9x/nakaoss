"use client";

import Link from "next/link";

interface PostListItemProps {
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

export default function PostListItem({ post }: PostListItemProps) {
  return (
    <article className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-slate-100 last:border-0">
      <div className="md:col-span-4 aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="md:col-span-8 flex flex-col h-full justify-center">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold text-naka-blue uppercase tracking-widest font-display">
            {post.category}
          </span>
          <span className="w-px h-3 bg-slate-300"></span>
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-display">
            {post.date}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif group-hover:text-naka-blue transition-colors leading-snug">
          <Link href={`/news/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3 leading-relaxed">
          {post.description}
        </p>
      </div>
    </article>
  );
}
