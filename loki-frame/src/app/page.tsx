import { getConfig, getImageData } from "@/utils/dbUtils";
import { ImageBackground } from "./components/ImageBackground/ImageBackgound";
import { Clock } from "./components/Clock";
import { ImagesContextProvider } from "./components/ImagesContext";

let url = "lokiframe.local";

export default async function Home() {
  let [images, config] = await Promise.all([getImageData(), getConfig()]);

  return (
    <main className="size-full">
      <div className="relative size-full">
        <ImagesContextProvider
          initConfig={config}
          initImages={images}
        >
          <ImageBackground addr={url} />
          <Clock />
        </ImagesContextProvider>
      </div>
    </main>
  );
}
