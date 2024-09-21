import { getImagesNames } from "@/utils/ImageUtil";
import { AddPhotoButton } from "./components/AddPhotoButton";
import ImageGrid from "./components/ImageGrid/ImageGrid";
import { headers } from "next/headers";
import { Header } from "../components/Header";
import { CatIcon } from "./components/CatIcon";
import * as motion from "framer-motion/client";

export default async function EditPage() {
  const images = await getImagesNames();
  const userAgent = headers().get("user-agent") || "";
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
  return (
    <div
      id="edit"
      className="container mx-auto flex flex-col size-full items-center transition duration-500 ease-in-out max-h-full"
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.9 }}
      >
        <Header
          icon={<CatIcon className="h-14" />}
          title="Loki-Frame"
          titleClassName="font-bold"
          rightIcon={<AddPhotoButton />}
        />
      </motion.div>
      <ImageGrid
        serverImages={images}
        isMobile={isMobile}
      />
    </div>
  );
}
