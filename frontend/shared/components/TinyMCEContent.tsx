"use client";
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "isomorphic-dompurify";
import { transformHtmlContent } from "@/shared/lib/image";

interface TinyMCEContentProps {
  content: string;
  className?: string; // Để có thể override styles từ bên ngoài (ví dụ: title banner)
}

export default function TinyMCEContent({
  content,
  className = "",
}: TinyMCEContentProps) {
  // Init state with content where src is temporarily replaced by data-src
  // This prevents browser from requesting relative paths (which triggers Next.js proxy and hangs)
  // Logic apply for BOTH Server and Client to match hydration and prevent server HTML from having bad src
  const [processedContent, setProcessedContent] = useState(() => {
    if (!content) return content;
    // Prevent loading relative images by renaming src to data-src
    return content.replace(/src=["'](\/uploads\/[^"']+)["']/g, 'data-src="$1"');
  });

  useEffect(() => {
    // Only process content on client side after hydration
    if (!content) return;

    // Use shared utility to transform content (handles absolute/relative URLs)
    const newContent = transformHtmlContent(content);
    setProcessedContent(newContent);
  }, [content]);

  // Sanitize content before rendering to prevent XSS attacks
  // Configured to allow SVG and Inline Styles properly like previous SunEditor needs
  const sanitizedContent = DOMPurify.sanitize(processedContent || "", {
    USE_PROFILES: { html: true, svg: true }, // Allow HTML and SVG
    ADD_TAGS: [
      "iframe",
      "style",
      "svg",
      "path",
      "circle",
      "rect",
      "line",
      "polyline",
      "polygon",
      "details",
      "summary",
      "figure",
      "figcaption",
      "video",
      "audio",
      "source",
      "track",
    ], // Allow embeds, advanced formatting, and media
    ADD_ATTR: [
      "allow",
      "allowfullscreen",
      "frameborder",
      "scrolling",
      "style",
      "class",
      "dir",
      "lang",
      "target",
      "rel",
      "href",
      "src",
      "alt",
      "title",
      "width",
      "height",
      "controls",
      "autoplay",
      "muted",
      "loop",
      "poster",
      "preload",
      "onmouseover",
      "onmouseout",
      "aria-label",
      "aria-hidden",
      "aria-expanded",
      "aria-controls",
      "viewBox",
      "fill",
      "opacity",
      "stroke",
      "stroke-width",
      "stroke-linecap",
      "stroke-linejoin",
      "d",
      "points",
      "x1",
      "y1",
      "x2",
      "y2",
      "cx",
      "cy",
      "r",
      "xmlns",
    ], // Allow full suite of attributes for tinyMCE advanced features
  });

  return (
    <div
      className={`tinymce-content-container font-inherit w-full h-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
