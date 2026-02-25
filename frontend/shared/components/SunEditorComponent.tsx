"use client";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useSunEditorUpload } from "../hooks/useSunEditorUpload";
import { getImageUrl, getRelativeImageUrl } from "@/shared/lib/image";

// Import SunEditor styles
import "suneditor/dist/css/suneditor.min.css";

// Import plugins
import {
  align,
  blockquote,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  textStyle,
  image,
  link,
  video,
  audio,
  math,
  template,
} from "suneditor/src/plugins";

// Skeleton UI when loading
function EditorSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="h-96 bg-gray-50 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    </div>
  );
}

// Dynamically import SunEditor to avoid SSR issues
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface SunEditorComponentProps {
  value: string;
  onChange: (_content: string) => void;
  placeholder?: string;
  height?: string;
}

export default function SunEditorComponent({
  value,
  onChange,
  placeholder,
  height = "auto",
}: SunEditorComponentProps) {
  const editorRef = useRef<any>(null);
  const previousContentRef = useRef<string>(""); // Store previous content for comparison
  const { handleImageUpload, handleImageDelete } = useSunEditorUpload();

  // Helper to transform HTML for Editor (relative -> absolute)
  const transformHtmlForEditor = useCallback((html: string): string => {
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
  }, []);

  // Helper to transform HTML for Storage (absolute -> relative)
  const transformHtmlForStorage = useCallback((html: string): string => {
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
  }, []);

  const handleImageUploadBefore = (
    files: File[],
    _info: any,
    uploadHandler: any,
  ): any => {
    const file = files[0];
    (async () => {
      try {
        const relativeImageUrl = await handleImageUpload(file);
        if (!relativeImageUrl) {
          uploadHandler(false);
          return;
        }

        const absoluteImageUrl = getImageUrl(relativeImageUrl);

        uploadHandler({
          result: [
            {
              url: absoluteImageUrl,
              name: file.name,
              size: file.size,
            },
          ],
        });
      } catch (error) {
        uploadHandler(false);
      }
    })();
    return undefined;
  };

  const handleEditorChange = (content: string) => {
    // Detect deleted images by comparing old and new content
    if (typeof document !== "undefined" && previousContentRef.current) {
      const oldParser = new DOMParser();
      const newParser = new DOMParser();
      const oldDoc = oldParser.parseFromString(
        previousContentRef.current,
        "text/html",
      );
      const newDoc = newParser.parseFromString(content, "text/html");

      const oldImages = Array.from(oldDoc.querySelectorAll("img")).map((img) =>
        img.getAttribute("src"),
      );
      const newImages = Array.from(newDoc.querySelectorAll("img")).map((img) =>
        img.getAttribute("src"),
      );

      // Find images that were removed
      const deletedImages = oldImages.filter(
        (src) => src && !newImages.includes(src),
      );

      // Delete removed images from storage
      deletedImages.forEach((src) => {
        if (src) {
          handleImageDelete(src);
        }
      });
    }

    // Update previousContentRef for next comparison
    previousContentRef.current = content;

    const contentForStorage = transformHtmlForStorage(content);
    onChange(contentForStorage);
  };

  // Handle image deletion when user removes image in editor
  const handleImageUploadCallback = useCallback(
    (
      targetElement: any,
      _index: number,
      state: string,
      imageInfo: any,
      _remainingFilesCount: number,
    ) => {
      if (state === "delete") {
        // imageInfo is NULL on delete, need to get src from targetElement
        let src = imageInfo?.src;

        if (!src && targetElement) {
          // Try to get src from targetElement (the actual img DOM element)
          if (targetElement.tagName === "IMG") {
            src = targetElement.getAttribute("src") || targetElement.src;
          }
        }

        if (src) {
          handleImageDelete(src);
        }
      }
    },
    [handleImageDelete],
  );

  // Full feature configuration
  const editorOptions = useMemo(
    () => ({
      // Basic configuration
      height: height,
      width: "100%",
      placeholder: placeholder || "Start typing...",
      mode: "classic" as const,
      rtl: false,

      // Plugins
      plugins: [
        align,
        blockquote,
        font,
        fontColor,
        fontSize,
        formatBlock,
        hiliteColor,
        horizontalRule,
        lineHeight,
        list,
        paragraphStyle,
        table,
        textStyle,
        image,
        link,
        video,
        audio,
        math,
        template,
      ],

      // Format options
      formats: [
        "p",
        "div",
        "blockquote",
        "pre",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ] as any[],

      // Toolbar buttons
      buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["paragraphStyle", "blockquote"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table", "link", "image", "video", "audio", "math", "template"],
        ["fullScreen", "showBlocks", "codeView"],
        ["preview", "print"],
      ],

      // Font configuration
      font: [
        "Arial",
        "Comic Sans MS",
        "Courier New",
        "Impact",
        "Georgia",
        "Tahoma",
        "Trebuchet MS",
        "Verdana",
        "Roboto",
        "Outfit",
      ],
      fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 36, 48, 60, 72, 96],
      fontSizeUnit: "px",

      // Color palette
      colorList: [
        "#ff0000",
        "#ff5e00",
        "#ffe400",
        "#abf200",
        "#00d8ff",
        "#0055ff",
        "#6600ff",
        "#ff00dd",
        "#000000",
        "#ffd8d8",
        "#fae0d4",
        "#faf4c0",
        "#e4f7ba",
        "#d4f4fa",
        "#d9e5ff",
        "#e8d9ff",
        "#ffd9fa",
        "#f1f1f1",
        "#ffa7a7",
        "#ffc19e",
        "#faed7d",
        "#cef279",
        "#b2ebf4",
        "#b2ccff",
        "#d1b2ff",
        "#ffb2f5",
        "#bdbdbd",
        "#f15f5f",
        "#f29661",
        "#e5d85c",
        "#bce55c",
        "#5cd1e5",
        "#6699ff",
        "#a366ff",
        "#f261df",
        "#8c8c8c",
        "#980000",
        "#993800",
        "#998a00",
        "#6b9900",
        "#008299",
        "#003399",
        "#3d0099",
        "#990085",
        "#353535",
        "#670000",
        "#662500",
        "#665c00",
        "#476600",
        "#005766",
        "#002266",
        "#290066",
        "#660058",
        "#222222",
      ],

      // Line height options
      lineHeights: [
        { text: "1", value: 1 },
        { text: "1.15", value: 1.15 },
        { text: "1.5", value: 1.5 },
        { text: "2", value: 2 },
        { text: "2.5", value: 2.5 },
        { text: "3", value: 3 },
      ],

      // Image configuration
      imageResizing: true,
      imageHeightShow: true,
      imageAlignShow: true,
      imageWidth: "auto",
      imageHeight: "auto",
      imageSizeOnlyPercentage: false,
      imageRotation: true,
      imageFileInput: true,
      imageUrlInput: true,
      imageMultipleFile: true,
      imageAccept: ".jpg,.jpeg,.png,.gif,.webp,.svg",
      mediaAutoSelect: true,

      // Video configuration
      videoResizing: true,
      videoHeightShow: true,
      videoAlignShow: true,
      videoRatioShow: true,
      videoWidth: "100%",
      videoHeight: "56.25%",
      videoSizeOnlyPercentage: false,
      videoRotation: false,
      videoRatio: 0.5625, // 16:9
      videoRatioList: [
        { name: "16:9", value: 0.5625 },
        { name: "4:3", value: 0.75 },
        { name: "21:9", value: 0.4285 },
      ],
      youtubeQuery: "",
      vimeoQuery: "",
      videoFileInput: false,
      videoUrlInput: true,
      videoAccept: ".mp4,.webm,.ogg",

      // Audio configuration
      audioWidth: "100%",
      audioHeight: "54px",
      audioFileInput: false,
      audioUrlInput: true,
      audioAccept: ".mp3,.wav,.ogg,.m4a",

      // Table configuration
      tableCellControllerPosition: "cell",

      // Link configuration
      linkTargetNewWindow: false,
      linkRel: [],
      linkNoPrefix: false,

      // Resizing bar
      resizingBar: true,
      showPathLabel: true,
      resizeEnable: true,

      // Math plugin (KaTeX)
      katex: katex,

      // Default style
      defaultStyle:
        "font-family: Arial; font-size: 16px; padding: 0; margin: 0; width: 100%; box-sizing: border-box; background-color: #ffffff;",
      // Templates
      templates: [
        {
          name: "Image Left, Text Right",
          html: `
            <div style="display: flex; gap: 20px; align-items: flex-start;">
              <div style="flex: 0 0 300px;">
                <img src="/placeholder.jpg" style="width: 100%; height: auto;" alt="Image" />
              </div>
              <div style="flex: 1;">
                <h3>Title Here</h3>
                <p>Enter your text here...</p>
              </div>
            </div>
          `,
        },
        {
          name: "Image Right, Text Left",
          html: `
            <div style="display: flex; gap: 20px; align-items: flex-start;">
              <div style="flex: 1;">
                <h3>Title Here</h3>
                <p>Enter your text here...</p>
              </div>
              <div style="flex: 0 0 300px;">
                <img src="/placeholder.jpg" style="width: 100%; height: auto;" alt="Image" />
              </div>
            </div>
          `,
        },
      ],
    }),
    [height, placeholder],
  );

  const [initialContent] = useState(() => transformHtmlForEditor(value));
  const [isReady, setIsReady] = useState(false);

  // Get instance and mark as ready
  const getSunEditorInstance = (sunEditor: any) => {
    editorRef.current = sunEditor;
    setIsReady(true);
  };

  // Sync external value changes to editor
  useEffect(() => {
    if (isReady && editorRef.current) {
      const currentEditorContent = editorRef.current.getContents();
      const currentStorageContent =
        transformHtmlForStorage(currentEditorContent);

      if (value !== currentStorageContent) {
        editorRef.current.setContents(transformHtmlForEditor(value));
      }
    }
  }, [value, isReady, transformHtmlForEditor, transformHtmlForStorage]);

  return (
    <div className="suneditor-wrapper">
      <SunEditor
        setContents={initialContent}
        onChange={handleEditorChange}
        setOptions={editorOptions}
        getSunEditorInstance={getSunEditorInstance}
        onImageUploadBefore={handleImageUploadBefore}
        onImageUpload={handleImageUploadCallback}
      />
    </div>
  );
}
