import { getImagesNames, getImageTest } from "@/utils/ImageUtil";
import { ImageBackground } from "./components/ImageBackground/ImageBackgound";
import { Clock } from "./components/Clock";
let ip = require("ip");

export default async function Home() {
  const images = await getImageTest();
  const addr = ip.address();
  return (
    <main className="size-full">
      <div className="relative size-full">
        <ImageBackground images={images} addr={addr} />
        <Clock />
      </div>
    </main>
  );
}
