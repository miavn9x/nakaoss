"use client";
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useSunEditorUpload } from "../hooks/useSunEditorUpload";
import { getImageUrl, getRelativeImageUrl } from "@/shared/lib/image";

interface TinyMCEComponentProps {
  value: string;
  onChange: (_content: string) => void;
  placeholder?: string;
  height?: string | number;
}

export default function TinyMCEComponent({
  value,
  onChange,
  placeholder = "Bắt đầu soạn thảo...",
  height = 500,
}: TinyMCEComponentProps) {
  const editorRef = useRef<any>(null);
  const { handleImageUpload, handleImageDelete } = useSunEditorUpload();
  const previousImagesRef = useRef<string[]>([]);
  const [internalValue, setInternalValue] = useState<string>("");

  // Helper to transform HTML for Editor (relative -> absolute)
  const transformHtmlForEditor = (html: string): string => {
    if (typeof document === "undefined" || !html) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("/uploads/")) {
        img.setAttribute("src", getImageUrl(src));
      }
    });
    return doc.body.innerHTML;
  };

  // Helper to transform HTML for Storage (absolute -> relative)
  const transformHtmlForStorage = (html: string): string => {
    if (typeof document === "undefined" || !html) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        img.setAttribute("src", getRelativeImageUrl(src));
      }
    });
    return doc.body.innerHTML;
  };

  useEffect(() => {
    // Only update internal editor content when external value changes completely
    const editorHtml = transformHtmlForEditor(value);
    if (
      editorRef.current &&
      value !== transformHtmlForStorage(editorRef.current.getContent())
    ) {
      setInternalValue(editorHtml);
    } else if (!editorRef.current) {
      setInternalValue(editorHtml);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Extract image sources to monitor deletions
  const extractImages = (html: string) => {
    if (typeof document === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img")).map(
      (img) => img.getAttribute("src") || "",
    );
  };

  const handleEditorChange = (content: string, editor: any) => {
    const currentImages = extractImages(content);

    // Check for deleted images
    const deletedImages = previousImagesRef.current.filter(
      (src) => src && !currentImages.includes(src),
    );

    // Trigger delete for missing images
    deletedImages.forEach((src) => {
      const relativePath = getRelativeImageUrl(src);
      if (relativePath) {
        handleImageDelete(relativePath);
      }
    });

    previousImagesRef.current = currentImages;
    setInternalValue(content); // Keep internal state in sync to avoid cursor jumping
    onChange(transformHtmlForStorage(content));
  };

  // Image upload handler for TinyMCE
  const example_image_upload_handler = (blobInfo: any, progress: any) =>
    new Promise<string>(async (resolve, reject) => {
      try {
        const file = blobInfo.blob();
        const relativeImageUrl = await handleImageUpload(file);

        if (!relativeImageUrl) {
          reject("Upload failed");
          return;
        }

        const absoluteImageUrl = getImageUrl(relativeImageUrl);
        resolve(absoluteImageUrl);
      } catch (err) {
        reject("Error uploading image");
      }
    });

  return (
    <div className="tinymce-wrapper">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(evt, editor) => {
          editorRef.current = editor;
          previousImagesRef.current = extractImages(editor.getContent());
        }}
        value={internalValue}
        onEditorChange={handleEditorChange}
        init={{
          height: height || 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | image media table | help",
          content_style: `
            body { font-family: Inter, Arial, sans-serif; font-size:16px } 
            img { max-width: 100% !important; height: auto !important; display: block; }
            figure.image { max-width: 100% !important; }
            figure.image img { max-width: 100% !important; height: auto !important; }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          image_advtab: true,
          image_dimensions: false, // Prevents TinyMCE from hardcoding width/height attrs
          image_class_list: [{ title: "Responsive", value: "img-responsive" }],

          // Allow SVG, Styles, and Events safely
          extended_valid_elements:
            "svg[width|height|viewBox|fill|aria-hidden|xmlns|stroke|stroke-width|stroke-linecap|stroke-linejoin|style|class|id|onmouseover|onmouseout],path[d|fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|opacity|style|class|id],circle,rect,line,polyline,polygon,style",
          valid_children:
            "+body[style],+svg[path|circle|rect|line|polyline|polygon]",

          // Image handling setup
          images_upload_handler: example_image_upload_handler,
          automatic_uploads: true,
          file_picker_types: "image",

          // Override paste to retain styles on standard tags (p, div, span, etc.)
          paste_retain_style_properties: "all",
          paste_webkit_styles: "all",
          paste_merge_formats: false,
        }}
      />
    </div>
  );
}
