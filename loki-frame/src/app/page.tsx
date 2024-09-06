import { getImagesNames } from "@/utils/ImageUtil";
import { PictureWall } from "./components/PictureWall";
import { Clock } from "./components/Clock";

export default async function Home() {
  const images = await getImagesNames();
  return (
    <main className="size-full p-5">
      <div className="relative size-full">
        <PictureWall images={images} />
        <Clock />
      </div>
    </main>
  );
}
