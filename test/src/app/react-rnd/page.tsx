import BannerEditor from "./components/BannerEditor";

export const metadata = {
  title: "Banner Editor - React Rnd",
  description: "Trình chỉnh sửa banner dùng react-rnd",
};

export default function ReactRndPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="w-full mx-auto bg-white rounded-xl shadow-md p-6">


        <BannerEditor />
      </div>
    </div>
  );
}
