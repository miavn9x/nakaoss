import BannerEditor from "./components/BannerEditor";

export const metadata = {
  title: "Banner Editor - React Rnd",
  description: "Trình chỉnh sửa banner dùng react-rnd",
};

export default function ReactRndPage() {
  return (
    <div className=" ">
      <div className="w-full mx-auto bg-white ">


        <BannerEditor />
      </div>
    </div>
  );
}
