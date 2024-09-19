"use client";
import { Area } from "react-easy-crop";
import PhotoEditor from "./PhotoEditor";
import { FC, useContext, useEffect, useState } from "react";
import { AddPhotoContext } from "../components/AddPhotosProvider";
import imageCompression from "browser-image-compression";
import { ImageFileData, readImageFile } from "@/utils/readImageFile";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { ImageProvider } from "./ImageContext";
import { Header } from "@/app/components/Header";

interface PhotoData extends ImageFileData {
  crop: Area | null;
}

export default function AddPhotoPage() {
  const [imagesToUpload, setImagesToUpload] = useState<PhotoData[]>([]);
  const { newPhotos } = useContext(AddPhotoContext);
  const router = useRouter();
  useEffect(() => {
    if (newPhotos.length == 0) {
      router.push("/edit");
      return;
    }
    let applyImages = true;
    let addPage = document.querySelector("#add");
    addPage?.classList.remove("translate-x-1/4");
    addPage?.classList.remove("opacity-0");
    const compressPhotos = async () => {
      let promises: Promise<ImageFileData>[] = [];
      for (let i = 0; i < newPhotos.length; i++) {
        promises.push(
          imageCompression(newPhotos[i], {
            maxWidthOrHeight: 2000,
            useWebWorker: true,
          }).then((file) => readImageFile(file))
        );
      }
      let data = await Promise.all(promises);
      if (!applyImages) return;
      setImagesToUpload(
        data.map((imgData) => ({
          ...imgData,
          crop: null,
        }))
      );
    };
    compressPhotos();
    return () => {
      applyImages = false;
    };
  }, [newPhotos, router]);

  if (newPhotos.length == 0) {
    return null;
  }

  return (
    <div
      id="add"
      className="transition duration-300 ease-in-out opacity-0 translate-x-1/4 size-full flex items-center justify-center flex-col"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {imagesToUpload.length == 0 ? (
          <motion.div
            key="load"
            className="size-full flex flex-col justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <span className="loading loading-spinner text-primary loading-lg" />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="size-full flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ImageProvider images={imagesToUpload}>
              <Mainbody />
            </ImageProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Mainbody: FC<{}> = () => {
  const router = useRouter();
  const { setNewPhotos } = useContext(AddPhotoContext);

  const closePage = () => {
    let addPage = document.querySelector("#add");
    addPage?.classList.add("translate-x-1/4");
    addPage?.classList.add("opacity-0");
    setTimeout(() => {
      setNewPhotos([]);
      router.replace("/edit");
    }, 300);
  };

  let backBtn = <button
    onClick={closePage}
    className="btn btn-square rounded-box btn-ghost text-3xl"
  >
    <IoIosArrowBack />
  </button>

  return (
    <>
      <Header icon={backBtn} title="Edit Photos" />
      <PhotoEditor onClose={closePage} />
    </>
  );
};

export { type PhotoData };
