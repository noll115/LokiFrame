import { getImagesNames, getImageTest } from "@/utils/ImageUtil";
import { AddPhotoButton } from "./components/AddPhotoButton";
import { FaCat } from "react-icons/fa";
import PhotoProvider from "./components/PhotoProvider";
import ImageDisplay from "./components/ImageDisplay";

export default async function EditPage() {
  const images = await getImageTest();

  return (
    <main className="p-8 justify-center size-full">
      <div className="flex flex-col items-center ">
        <PhotoProvider initImages={images}>
          <div className=" w-full flex justify-between items-center mb-5 text-4xl">
            <span className="flex gap-4">
              <FaCat />
              <h3>Loki-Frame</h3>
            </span>
            <AddPhotoButton />
          </div>
          <ImageDisplay />
        </PhotoProvider>
      </div>
    </main>
  );
}
