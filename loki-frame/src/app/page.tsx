import { getConfig, getImageData } from "@/utils/dbUtils";
import { AddPhotoButton } from "./components/AddPhotoButton";
import ImageGrid from "./components/ImageGrid/ImageGrid";
import { headers } from "next/headers";
import { Header } from "./frame/components/Header";
import { CatIcon } from "./components/CatIcon";
import * as motion from "framer-motion/client";
import { SettingsButton } from "./components/SettingsButton";

export default async function EditPage() {
  const images = await getImageData();
  const config = await getConfig();
  const userAgent = headers().get("user-agent") || "";
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);

  return (
    <div
      id="edit"
      className="container m-auto flex flex-col size-full items-center transition duration-500 ease-in-out max-h-full"
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.9 }}
      >
        <Header
          icon={<CatIcon className="h-14 stroke-neutral" />}
          title="Loki-Frame"
          titleClassName="font-bold"
          rightIcon={
            <span className="join gap-2">
              <SettingsButton initConfig={config} />
              <AddPhotoButton />
            </span>
          }
        />
      </motion.div>
      <ImageGrid
        serverImages={images}
        isMobile={isMobile}
      />
    </div>
  );
}
