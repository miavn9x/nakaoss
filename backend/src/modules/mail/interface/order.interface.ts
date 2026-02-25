// --- Interface Chi Tiết Mail Đơn Hàng ---
export interface OrderMailData {
  code: string; // Mã đơn hàng
  email: string;
  phone: string;
  shippingAddress: string;
  subTotal: number; // Tổng tiền hàng
  discountValue: number; // Tiền giảm giá
  couponCode?: string; // Mã voucher (nếu có)
  totalPrice: number; // Tổng thanh toán
  products: {
    productCode: string; // Mã sản phẩm
    productName: string;
    variant: {
      label: string; // Ví dụ: "Xanh - L"
      price: {
        original: number;
        discountPercent: number;
      };
    };
    quantity: number;
  }[];
}
