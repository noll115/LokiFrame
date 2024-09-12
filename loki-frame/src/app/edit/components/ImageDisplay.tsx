"use client";

import { useContext } from "react";
import ImagePreview from "./ImagePreview";
import { PhotoContext } from "./PhotoProvider";

export default function ImageDisplay() {
  const { images } = useContext(PhotoContext);

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-1 max-w-max size-full">
      {images.map((img) => (
        <div className="h-40 md:h-60 relative" key={img}>
          <ImagePreview imageUrl={img} />
        </div>
      ))}
    </div>
  );
}
