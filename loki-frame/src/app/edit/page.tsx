import { getImagesNames } from "@/utils/ImageUtil";
import { AddPhotoButton } from "./components/AddPhotoButton";
import { FaCat } from "react-icons/fa";
import ImageGrid from "./components/ImageGrid";
import { headers } from "next/headers";

export default async function EditPage() {
  const images = await getImagesNames();
  const userAgent = headers().get("user-agent") || "";
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
  return (
    <div
      id="edit"
      className="flex flex-col size-full items-center transition duration-500 ease-in-out max-h-full"
    >
      <div className=" w-full relative flex justify-between items-center mb-5 text-4xl ">
        <span className="flex gap-4">
          <FaCat />
          <h3>Loki-Frame</h3>
        </span>
        <AddPhotoButton />
      </div>
      <ImageGrid serverImages={images} isMobile={isMobile} />
    </div>
  );
}
