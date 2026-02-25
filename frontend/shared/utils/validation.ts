/**
 * Danh sách các ký tự đặc biệt bị cấm trong tên danh mục (Blacklist).
 * Chỉ chặn những ký tự thực sự gây lỗi hoặc không hợp lệ.
 * Cho phép mọi chữ cái, số, khoảng trắng và các dấu câu cơ bản như ( ) - . , / : &
 */
export const INVALID_NAME_CHARS_LIST = "!@#$%^&*+=[]{}|\\<>?~_";

/**
 * Kiểm tra tính hợp lệ của tên.
 * @returns true nếu tên hợp lệ (không chứa ký tự cấm).
 */
export const isValidName = (name: string, _lang?: string): boolean => {
  if (!name || name.trim() === "") return true;

  // Duyệt qua từng ký tự để kiểm tra blacklist (an toàn hơn Regex phức tạp)
  for (const char of name) {
    if (INVALID_NAME_CHARS_LIST.includes(char)) {
      return false;
    }
  }
  return true;
};
