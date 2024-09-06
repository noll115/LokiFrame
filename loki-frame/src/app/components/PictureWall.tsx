"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

let timePerPictureMS = 30 * 1000;

const PictureWall = ({ images }: { images: string[] }) => {
  const [showPicture, SetShowPicture] = useState(false);
  const [pictureIndex, setPicIndex] = useState(0);
  let picOpacity = showPicture ? "opacity-100" : "opacity-0";
  let timeOutRef = useRef<NodeJS.Timeout>();
  console.log(images);

  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  const onPictureLoad = () => {
    SetShowPicture(true);
    timeOutRef.current = setTimeout(switchPicture, timePerPictureMS);
  };

  const switchPicture = () => {
    setPicIndex((pictureIndex + 1) % images.length);
  };

  if (images.length == 0) {
    return null;
  }

  return (
    <div className="size-full flex justify-center items-center overflow-clip">
      <Image
        className={`rounded-lg transition-opacity duration-700 ${picOpacity}`}
        src={images[0]}
        width={600}
        height={1024}
        alt="Pic of cats"
        onLoad={onPictureLoad}
      />
    </div>
  );
};

export { PictureWall };
