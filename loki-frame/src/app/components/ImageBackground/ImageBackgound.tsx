"use client";
import { FC, useRef, useState } from "react";
import { FaCat } from "react-icons/fa";
import ImageTransition from "./NormalState";

interface Props {
  images: string[];
  addr: string;
}

const ImageBackground: FC<Props> = ({ images, addr }) => {
  if (images.length == 0) {
    return (
      <div className="size-full modal-backdrop flex justify-center items-center">
        <div className="bg-primary text-primary-content modal-box flex flex-col text-2xl justify-center items-center">
          <FaCat className="text-5xl mb-3" />
          Connect to <b>{addr}/edit</b>
        </div>
      </div>
    );
  }
  return (
    <div className="size-full">
      <ImageTransition images={images} />
    </div>
  );
};

export { ImageBackground };
