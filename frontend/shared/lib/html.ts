import striptags from "striptags";

export const stripHtml = (html: string): string => {
  if (!html) return "";
  return striptags(html).trim();
};
