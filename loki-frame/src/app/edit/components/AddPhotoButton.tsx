"use client";
import { ChangeEventHandler, FC, useContext, useRef, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AddPhotoContext } from "./AddPhotosProvider";

const pause = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

const AddPhotoButton: FC = () => {
  const { setNewPhotos } = useContext(AddPhotoContext);
  let fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    let files = event.target.files;
    if (files == null) return;
    let photoFiles = [];
    for (let i = 0; i < files.length; i++) {
      photoFiles.push(files[i]);
    }
    setNewPhotos(photoFiles);
    let editPage = document.querySelector("#edit");
    editPage?.classList.add("-translate-x-1/4");
    editPage?.classList.add("opacity-0");
    await pause(400);
    router.push("/edit/add");
  };

  const onBtnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        className="btn btn-square rounded-box btn-ghost text-3xl"
        onClick={onBtnClick}
      >
        <MdAddAPhoto />
      </button>
      <input
        type="file"
        multiple
        accept=".png, .jpg, .jpeg"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </>
  );
};

export { AddPhotoButton };
