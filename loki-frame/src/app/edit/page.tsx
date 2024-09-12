import { getImagesNames, getImageTest } from "@/utils/ImageUtil";
import { AddPhotoButton } from "./components/AddPhotoButton";
import { FaCat } from "react-icons/fa";
import ImageDisplay from "./components/ImageDisplay";

export default async function EditPage() {
  const images = await getImageTest();

  return (
    <div
      id="edit"
      className="flex flex-col items-center transition duration-500 ease-in-out"
    >
      <div className=" w-full flex justify-between items-center mb-5 text-4xl">
        <span className="flex gap-4">
          <FaCat />
          <h3>Loki-Frame</h3>
        </span>
        <AddPhotoButton />
      </div>
      <ImageDisplay images={images} />
    </div>
  );
}
