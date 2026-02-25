// --- Interface Dữ Liệu Mail ---

// 1. Data Gửi Mail Liên Hệ
export interface ContactMailData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  subject: string;
  content: string;
}

// 2. Data Gửi Mail Đơn Hàng (Rút Gọn)
export interface OrderMailData {
  code: string;
  email: string;
  phone: string;
  shippingAddress: string;
  totalPrice: number;
}
