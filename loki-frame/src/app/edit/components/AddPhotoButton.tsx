"use client";
import { ChangeEventHandler, FC, useContext, useRef, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { PhotoContext } from "./PhotoProvider";
import AddPhotoPortal from "./AddPhotoPortal";
import imageCompression from "browser-image-compression";
import { ImageFileData, readImageFile } from "@/utils/readImageFile";
import { Area } from "react-easy-crop";

interface PhotoData {
  file: File;
  dataUrl: string;
  crop: Area | null;
}

const AddPhotoButton: FC = () => {
  const { setImages, images } = useContext(PhotoContext);
  let [imagesToUpload, setImagesToUpload] = useState<PhotoData[]>([]);
  let fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    let files = event.target.files;
    if (files == null) return;
    let promises: Promise<ImageFileData>[] = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(
        imageCompression(files[i], {
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        }).then((file) => readImageFile(file))
      );
    }
    let data = await Promise.all(promises);
    setImagesToUpload(data.map((imgData) => ({ ...imgData, crop: null })));
  };

  const submitFiles = async () => {
    if (imagesToUpload == null) return;
    let formData = new FormData();
    for (let i = 0; i < imagesToUpload.length; i++) {
      formData.append(`files[]`, imagesToUpload[i]);
    }
    let resp = await fetch("/api/new", { body: formData, method: "POST" });
    let newImgs = (await resp.json()) as string[];
    setImages(newImgs);
  };

  const onPortalClose = () => {
    setImagesToUpload([]);
  };

  const onBtnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <AddPhotoPortal
        imagesToUpload={imagesToUpload}
        onPortalClose={onPortalClose}
      />
      <button
        className="btn btn-square rounded-box btn-ghost text-3xl"
        onClick={onBtnClick}
      >
        <MdAddAPhoto />
      </button>
      <input
        type="file"
        multiple
        accept=".png, .jpg"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </>
  );
};

export { AddPhotoButton, type PhotoData };
