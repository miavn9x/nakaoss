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
          menubar: "file edit view insert format tools table help",
          plugins: [
            "accordion",
            "advlist",
            "anchor",
            "autolink",
            "autoresize",
            "autosave",
            "charmap",
            "code",
            "codesample",
            "directionality",
            "emoticons",
            "fullscreen",
            "help",
            "image",
            "importcss",
            "insertdatetime",
            "link",
            "lists",
            "media",
            "nonbreaking",
            "pagebreak",
            "preview",
            "quickbars",
            "save",
            "searchreplace",
            "table",
            "visualblocks",
            "visualchars",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | " +
            "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | forecolor backcolor removeformat | " +
            "image media table link anchor codesample | charmap emoticons insertdatetime pagebreak accordion | " +
            "searchreplace visualblocks preview fullscreen ltr rtl | help",
          toolbar_mode: "wrap",

          // --- Advanced Features Configuration ---
          autosave_ask_before_unload: true,
          autosave_interval: "30s",
          autosave_prefix: "{path}{query}-{id}-",
          autosave_restore_when_empty: false,
          autosave_retention: "2m",

          image_caption: true,
          media_live_embeds: true,
          link_default_target: "_blank",
          table_toolbar:
            "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",

          quickbars_selection_toolbar:
            "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
          quickbars_insert_toolbar: "quickimage quicktable | hr pagebreak",
          contextmenu: "link image table",
          font_family_formats:
            "Inter=Inter, sans-serif;" +
            "Merriweather=Merriweather, serif;" +
            "Roboto=Roboto, sans-serif;" +
            "Open Sans='Open Sans', sans-serif;" +
            "Lato=Lato, sans-serif;" +
            "Montserrat=Montserrat, sans-serif;" +
            "Poppins=Poppins, sans-serif;" +
            "Playfair Display='Playfair Display', serif;" +
            "Arial=arial,helvetica,sans-serif;" +
            "Arial Black='Arial Black',avant garde;" +
            "Book Antiqua='Book Antiqua',palatino;" +
            "Calibri=Calibri,sans-serif;" +
            "Cambria=Cambria,serif;" +
            "Century Gothic='Century Gothic',sans-serif;" +
            "Comic Sans MS='Comic Sans MS',sans-serif;" +
            "Consolas=Consolas,monospace;" +
            "Courier New='Courier New',courier;" +
            "Georgia=georgia,palatino;" +
            "Helvetica=helvetica;" +
            "Impact=impact,chicago;" +
            "Oswald=Oswald,sans-serif;" +
            "Tahoma=tahoma,arial,helvetica,sans-serif;" +
            "Times New Roman='Times New Roman',times;" +
            "Trebuchet MS='Trebuchet MS',geneva;" +
            "Verdana=verdana,geneva;",
          font_size_formats:
            "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt 60pt 72pt 84pt 96pt 120pt",
          content_style: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Lato:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
            .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; display: inline-block; line-height: 1; text-transform: none; letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr; -webkit-font-smoothing: antialiased; }
            body { font-family: 'Inter', Arial, sans-serif; font-size:16px; line-height: 1.6; color: #334155; } 
            
            h1, h2, h3, h4, h5, h6 { color: #0f172a; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.3; }
            h1 { font-size: 2.25em; } h2 { font-size: 1.5em; } h3 { font-size: 1.25em; } h4 { font-size: 1em; }
            
            p { margin-top: 0; margin-bottom: 1.25em; }
            ul, ol { margin-top: 0; margin-bottom: 1.25em; padding-left: 1.625em; }
            ul { list-style-type: disc; } ol { list-style-type: decimal; }
            li { margin-bottom: 0.5em; } ul ul, ol ol { margin-top: 0.5em; margin-bottom: 0; }
            
            a { color: #1d3b78; text-decoration: underline; }
            a:hover { color: #1152d4; }
            b, strong { font-weight: 700; color: #0f172a; }
            i, em { font-style: italic; }
            
            blockquote { border-left: 4px solid #1d3b78; padding-left: 1rem; margin-left: 0; margin-right: 0; font-style: italic; color: #475569; background-color: #f8fafc; padding: 1rem; border-radius: 4px; }
            
            img, video { max-width: 100% !important; height: auto !important; margin-top: 1.5em; margin-bottom: 1.5em; border-radius: 8px; display: block; }
            figure { margin: 1.5em 0; max-width: 100% !important; }
            figure.image img { max-width: 100% !important; height: auto !important; margin: 0; }
            figcaption { font-size: 0.875em; color: #64748b; text-align: center; margin-top: 0.5em; font-style: italic; }
            
            details { background-color: #f1f5f9; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #e2e8f0; }
            details summary { font-weight: 600; cursor: pointer; color: #0f172a; }
            details > *:not(summary) { margin-top: 1rem; }
            
            table { width: 100%; margin-bottom: 1.5em; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; }
            th { background-color: #f1f5f9; font-weight: 600; color: #0f172a; }
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
          paste_webkit_styles: "all",
          paste_merge_formats: false,
        }}
      />
    </div>
  );
}
