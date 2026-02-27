// Dữ liệu sản phẩm dùng chung giữa danh sách và trang chi tiết

export interface ProductSpec {
  label: string;
  value: string;
  icon: string;
}

export interface Product {
  id: string;
  subCategory: string;
  name: string;
  desc: string;
  img: string;
  specs: ProductSpec[];
  tag: string;
}

export const TECHNICAL_DATA: Record<string, Product[]> = {
  truot: [
    {
      id: "NHT-1052",
      subCategory: "dong-cua",
      name: "Bộ thu gom Shuttle Closer Collect W (ray 28mm) / NHT-1052",
      desc: "Bộ giảm chấn tương thích với ray rộng 28mm. Chất lượng cao đạt được nhờ năm cải tiến về hiệu suất. Lắp đặt dễ dàng bằng cần gạt.",
      img: "/product/SNS3D黒単体加工済みd.png",
      specs: [
        { label: "Vật liệu", value: "Thép không gỉ, POM", icon: "inventory_2" },
        { label: "Hoàn thiện", value: "Cromat hóa trị ba", icon: "texture" },
        { label: "Mã đơn hàng", value: "NHT-1052", icon: "qr_code" },
        { label: "Thông số", value: "Ray 28mm", icon: "settings" },
      ],
      tag: "Shuttle Closer W",
    },
    {
      id: "NHT-1051",
      subCategory: "dong-cua",
      name: "Bộ thu gom Shuttle Closer Collect S (ray 28mm) / NHT-1051",
      desc: "Con lăn ổ trục 19Φ vận hành siêu êm. Lắp đặt và tháo rời dễ dàng chỉ bằng một thao tác gạt cần đơn giản.",
      img: "/img/ptoduct/nht-1051.png",
      specs: [
        { label: "Vật liệu", value: "Thép không gỉ, POM", icon: "inventory_2" },
        { label: "Hoàn thiện", value: "Cromat hóa trị ba", icon: "texture" },
        { label: "Mã đơn hàng", value: "NHT-1051", icon: "qr_code" },
        { label: "Thông số", value: "Ray 28mm, Trục 19Φ", icon: "settings" },
      ],
      tag: "Shuttle Closer S",
    },
    {
      id: "NHT-1058",
      subCategory: "dong-cua",
      name: "Shuttle Closer Collect W for Outset / NHT-1058",
      desc: "Thông số kỹ thuật ban đầu của Shuttle Closer Collect W. Bao gồm thân máy, bộ cò súng đặt ngoài và khung gá lắp chuyên dụng.",
      img: "/img/ptoduct/nht-1052_02.png",
      specs: [
        { label: "Vật liệu", value: "Thép không gỉ, POM", icon: "inventory_2" },
        { label: "Hoàn thiện", value: "Cromat hóa trị ba", icon: "texture" },
        { label: "Mã đơn hàng", value: "NHT-1058", icon: "qr_code" },
        { label: "Thông số", value: "Outset Specification", icon: "settings" },
      ],
      tag: "Outset Version",
    },
  ],
  orido: [],
};
