import { FC, useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";
import PhotoEditor from "./PhotoEditor";
import type { PhotoData } from "./AddPhotoButton";

interface Props {
  imagesToUpload: PhotoData[];
  onPortalClose: () => void;
}
const AddPhotoPortal: FC<Props> = ({ imagesToUpload, onPortalClose }) => {
  let modalOpen = imagesToUpload.length > 0 ? "modal-open" : "";

  return (
    <dialog className={`modal ${modalOpen}`}>
      <div className="modal-box w-11/12 sm:w-10/12 h-5/6 max-w-5xl flex flex-col">
        <div className="flex text-xl sm:text-2xl justify-center items-center relative mb-1 sm:mb-6">
          <h1>Edit Photo</h1>
          <button
            className="absolute h-full right-0 top-0 text-2xl"
            onClick={onPortalClose}
          >
            <IoMdClose />
          </button>
        </div>
        {imagesToUpload.length > 0 && (
          <PhotoEditor imagesToUpload={imagesToUpload} />
        )}
        <div className="m-auto mt-7">
          <button className="btn btn-primary rounded-box  btn-lg text-lg">
            Upload <IoMdCloudUpload className="text-2xl" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AddPhotoPortal;
