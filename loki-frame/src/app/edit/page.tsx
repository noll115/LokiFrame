import { getImagesNames } from "@/utils/ImageUtil";
import Image from "next/image";
import { AddPhotoButton } from "../components/AddPhotoButton";
import { FaCat } from "react-icons/fa";
import PhotoProvider from "./components/PhotoProvider";

export default async function EditPage() {
  const images = await getImagesNames();

  let imageDisplays = images.map((img) => (
    <ImageDisplay imageUrl={img} key={img} />
  ));
  return (
    <main className="flex justify-center">
      <div className="max-w-fit p-5 flex flex-col items-center">
        <PhotoProvider initImages={images}>
          <div className="w-full flex justify-between items-center mb-10 text-4xl">
            <span className="flex gap-4">
              <FaCat />
              <h3>Loki-Frame</h3>
            </span>
            <AddPhotoButton />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-1 max-w-max">
            {imageDisplays}
          </div>
        </PhotoProvider>
      </div>
    </main>
  );
}

const ImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <span className="group relative h-40 md:h-60 aspect-[9/16] hover:cursor-pointer ">
      <Image
        src={imageUrl}
        alt={imageUrl}
        fill
        quality={50}
        className="rounded-lg object-cover group-hover:scale-90 transition-transform "
        loading="lazy"
        placeholder="empty"
      />
    </span>
  );
};
