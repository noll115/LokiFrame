"use client";
import { Area } from "react-easy-crop";
import PhotoEditor from "./PhotoEditor";
import { useContext, useEffect, useState } from "react";
import { AddPhotoContext } from "@/app/components/AddPhotosProvider";
import imageCompression from "browser-image-compression";
import { ImageFileData, readImageFile } from "@/utils/readImageFile";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";
import { ImageProvider } from "./ImageContext";
import { Header } from "@/app/frame/components/Header";
import LoadingBg from "./LoadingBg";

interface PhotoData extends ImageFileData {
  crop: Area | null;
}

export default function AddPhotoPage() {
  const [imagesToUpload, setImagesToUpload] = useState<PhotoData[]>([]);
  const { newPhotos } = useContext(AddPhotoContext);
  const router = useRouter();

  useEffect(() => {
    if (newPhotos.length == 0) {
      router.push("/");
      return;
    }

    let abortCont = new AbortController();

    const compressPhotos = async () => {
      let promises: Promise<ImageFileData>[] = [];
      for (let i = 0; i < newPhotos.length; i++) {
        promises.push(
          imageCompression(newPhotos[i], {
            maxWidthOrHeight: 2000,
            useWebWorker: true,
            preserveExif: true,
            signal: abortCont.signal,
          }).then((file) => readImageFile(file, newPhotos[i].name))
        );
      }
      try {
        let data = await Promise.all(promises);
        setImagesToUpload(
          data.map((imgData) => ({
            ...imgData,
            crop: null,
          }))
        );
      } catch {}
    };
    compressPhotos();
    return () => {
      abortCont.abort("demount");
    };
  }, [newPhotos, router]);

  if (newPhotos.length == 0) {
    return null;
  }
  return (
    <motion.div
      id="add"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-2 size-full flex items-center justify-center flex-col "
    >
      <AnimatePresence
        initial={false}
        mode="popLayout"
      >
        {imagesToUpload.length == 0 ? (
          <LoadingBg key="load" />
        ) : (
          <motion.div
            key="main"
            className="container size-full flex flex-col justify-center items-center"
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
    </motion.div>
  );
}

const Mainbody = () => {
  const router = useRouter();
  const { setNewPhotos } = useContext(AddPhotoContext);
  let [loading, setLoading] = useState(false);

  const closePage = () => {
    setTimeout(() => {
      setNewPhotos([]);
      router.replace("/");
    }, 300);
  };

  let backBtn = (
    <button
      onClick={closePage}
      className="btn btn-square rounded-box  btn-ghost  text-4xl"
    >
      <IoIosArrowBack />
    </button>
  );

  if (loading) {
    return <LoadingBg />;
  }

  return (
    <>
      <Header
        icon={backBtn}
        title="Edit Photos"
      />
      <PhotoEditor
        setLoading={setLoading}
        onClose={closePage}
      />
    </>
  );
};

export { type PhotoData };
