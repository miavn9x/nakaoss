/**
 * Trích xuất danh sách URL hình ảnh từ chuỗi HTML.
 * @param html Nội dung HTML cần phân tích
 * @returns Mảng chứa các URL của thẻ <img>
 */
export function extractImageUrlsFromHtml(html: string): string[] {
  if (!html) return [];
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }
  return urls;
}

/**
 * Encode các ký tự đặc biệt để tránh HTML Injection
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
