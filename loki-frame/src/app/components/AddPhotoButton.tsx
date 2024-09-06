"use client";
import { ChangeEventHandler, FC, useContext } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { PhotoContext } from "../edit/components/PhotoProvider";

const AddPhotoButton: FC = () => {
  const { setImages } = useContext(PhotoContext);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    let files = event.target.files;
    if (files == null) return;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`files[]`, files[i]);
    }
    let resp = await fetch("/api/new", { body: formData, method: "POST" });
    let newImgs = (await resp.json()) as string[];
    setImages(newImgs);
  };

  return (
    <label className="group mr-5 p-2 hover:cursor-pointer">
      <MdAddAPhoto className="group-hover:scale-125 duration-300 transition-transform ease-in-out" />
      <input
        type="file"
        multiple
        accept=".png, .jpg"
        className="hidden"
        onChange={onFileChange}
      />
    </label>
  );
};

export { AddPhotoButton };
