import Image from "next/image";

interface PageBannerProps {
  src?: string;
  alt?: string;
}

const PageBanner = ({
  src = "/banner/melatoslide.jpg",
  alt = "Page Banner",
}: PageBannerProps) => {
  return (
    <div className="w-full">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
        priority
      />
    </div>
  );
};

export default PageBanner;
