import AdvantagePage from "@/features/client/advantage/AdvantagePage";

export async function generateMetadata() {
  return {
    title: "Lợi Thế - Nakao Việt Nam",
    description:
      "Khám phá những lợi thế vượt trội từ chất lượng, thẩm mỹ đến khả năng vận hành của cửa nhôm kính Nakao Việt Nam.",
  };
}

export default function Page() {
  return <AdvantagePage />;
}
