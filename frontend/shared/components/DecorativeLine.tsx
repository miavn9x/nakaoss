import Image from "next/image";

const DecorativeLine = () => {
  return (
    <div className="w-full flex justify-center py-6">
      <Image
        src="/icons/abt-line.png"
        alt="Decorative Line"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto max-w-full"
      />
    </div>
  );
};

export default DecorativeLine;
