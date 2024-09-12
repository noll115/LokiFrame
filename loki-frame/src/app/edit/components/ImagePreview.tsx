import Image from "next/image";
import { FC } from "react";

interface Props {
  imageUrl: string;
}

const ImagePreview: FC<Props> = ({ imageUrl }) => {
  return (
    <div className="size-full relative aspect-[0.59/1] ">
      <Image
        src={imageUrl}
        alt={imageUrl}
        fill
        quality={50}
        className="object-contain"
        loading="lazy"
        placeholder="empty"
        onLoad={(e) => {
          let img = e.currentTarget;
          console.log(img.naturalWidth, img.naturalHeight);
        }}
      />
    </div>
  );
};

export default ImagePreview;
