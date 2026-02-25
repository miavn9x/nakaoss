"use client";

import React, { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import "suneditor/dist/css/suneditor.min.css";
import "suneditor/src/assets/css/suneditor-contents.css";
import "katex/dist/katex.min.css";
import { transformHtmlContent } from "@/shared/lib/image";

interface SunEditorContentProps {
  content: string;
  className?: string; // Để có thể override styles từ bên ngoài (ví dụ: title banner)
}

export default function SunEditorContent({
  content,
  className = "",
}: SunEditorContentProps) {
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
  const sanitizedContent = DOMPurify.sanitize(processedContent || "", {
    ADD_TAGS: ["iframe"], // Allow iframes for embedded content (e.g., YouTube)
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"], // Allow iframe attributes
  });

  return (
    <div
      className={`sun-editor-editable w-auto h-auto bg-[#fdfce8]! p-0 font-inherit ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
