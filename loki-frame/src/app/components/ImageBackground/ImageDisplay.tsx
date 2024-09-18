import { default as NextImage } from "next/image";
import { FC } from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH, type Image } from "./types";
import { motion, useAnimate } from "framer-motion";

interface Props {
  image: Image;
  onPictureLoad?: (image: Image) => void;
  opacity: number;
  onTransitionEnd?: (image: Image) => void;
}

const Image = motion.create(NextImage);

const ImageDisplay: FC<Props> = ({
  image,
  onPictureLoad,
  opacity,
  onTransitionEnd,
}) => {
  const onLoad = () => {
    onPictureLoad?.(image);
  };

  const onImageTransitionEnd = () => {
    onTransitionEnd?.(image);
  };

  return (
    <Image
      animate={{ opacity }}
      style={{ height: SCREEN_HEIGHT }}
      transition={{ duration: 3 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onImageTransitionEnd}
      className="absolute opacity-0"
      src={image.image}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      alt="Pic of cats"
      onLoad={onLoad}
    />
  );
};

export default ImageDisplay;
