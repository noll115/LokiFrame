"use client";
import { Area } from "react-easy-crop";
import PhotoEditor from "./PhotoEditor";
import { FC, forwardRef, useContext, useEffect, useState } from "react";
import { AddPhotoContext } from "../components/AddPhotosProvider";
import imageCompression from "browser-image-compression";
import { ImageFileData, readImageFile } from "@/utils/readImageFile";
import { useRouter } from "next/navigation";
import { FaUpload } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";

interface PhotoData extends ImageFileData {
  crop: Area | null;
}
export default function AddPhotoPage() {
  const [imagesToUpload, setImagesToUpload] = useState<PhotoData[]>([]);
  const { newPhotos } = useContext(AddPhotoContext);
  const router = useRouter();

  useEffect(() => {
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
      setImagesToUpload(data.map((imgData) => ({ ...imgData, crop: null })));
    };
    compressPhotos();
  }, [newPhotos]);

  useEffect(() => {
    let addPage = document.querySelector("#add");
    addPage?.classList.remove("translate-x-1/4");
    addPage?.classList.remove("opacity-0");
  }, []);

  if (newPhotos.length == 0) {
    router.push("/edit");
    return null;
  }

  return (
    <div
      id="add"
      className="transition duration-300 ease-in-out opacity-0 translate-x-1/4 size-full flex items-center justify-center flex-col"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {imagesToUpload.length == 0 ? (
          <AnimHeader key="loading">
            <span className="loading loading-spinner text-primary loading-lg" />
          </AnimHeader>
        ) : (
          <AnimHeader key="files">
            <Mainbody imagesToUpload={imagesToUpload} />
          </AnimHeader>
        )}
      </AnimatePresence>
    </div>
  );
}

const AnimHeader = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <motion.div
        className="size-full flex flex-col justify-center items-center"
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }
);

const Mainbody: FC<{ imagesToUpload: PhotoData[] }> = ({ imagesToUpload }) => {
  const router = useRouter();
  const submitFiles = async () => {
    let formData = new FormData();
    for (let i = 0; i < imagesToUpload.length; i++) {
      formData.append(`files[]`, imagesToUpload[i]);
    }
    let resp = await fetch("/api/new", { body: formData, method: "POST" });
    let newImgs = (await resp.json()) as string[];
  };

  return (
    <>
      <div className="flex w-full justify-start items-center text-3xl pb-5 gap-4">
        <IoIosArrowBack onClick={() => router.back()} />
        Edit Photos
      </div>
      <PhotoEditor imagesToUpload={imagesToUpload} />
      <button
        onClick={submitFiles}
        className="btn bg-primary btn-lg rounded-box text-2xl w-full"
      >
        Upload <FaUpload className="text-2xl" />
      </button>
    </>
  );
};

export { type PhotoData };
