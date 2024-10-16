"use client";
import { ChangeEventHandler, FC, useContext, useRef } from "react";
import { MdAddAPhoto, MdArrowUpward } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AddPhotoContext } from "./AddPhotosProvider";

interface Props {
  hasImages: boolean;
}

const AddPhotoButton = ({ hasImages }: Props) => {
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
    setTimeout(() => router.push("/add"), 400);
  };

  const onBtnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        className="btn btn-square btn-ghost text-3xl relative"
        onClick={onBtnClick}
      >
        <MdAddAPhoto />
        {!hasImages && (
          <div className="absolute top-full pointer-events-none min-w-max right-2 text-xl md:text-2xl">
            <span className="">Start adding photos!</span>
            <MdArrowUpward className="inline-block animate-bounce text-3xl" />
          </div>
        )}
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
