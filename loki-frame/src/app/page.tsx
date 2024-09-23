import { getConfig, getImageData } from "@/utils/dbUtils";
import { ImageBackground } from "./components/ImageBackground/ImageBackgound";
import { Clock } from "./components/Clock";
import { ImagesContextProvider } from "./components/ImagesContext";
let ip = require("ip");

export default async function Home() {
  let [images, config] = await Promise.all([getImageData(), getConfig()]);
  // images = images.map((img) => ({
  //   ...img,
  //   lat: Number(img.lat),
  //   long: Number(img.long),
  // }));
  const addr = ip.address();

  return (
    <main className="size-full">
      <div className="relative size-full">
        <ImagesContextProvider
          initConfig={config}
          initImages={images}
        >
          <ImageBackground addr={addr} />
        </ImagesContextProvider>
        {images.length > 0 && <Clock />}
      </div>
    </main>
  );
}
