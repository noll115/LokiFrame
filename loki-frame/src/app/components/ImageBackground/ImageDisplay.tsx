import { default as NextImage } from "next/image";
import { FC } from "react";
import { BackgroundImage, SCREEN_HEIGHT, SCREEN_WIDTH } from "./types";
import { motion } from "framer-motion";

interface Props {
  bgImage: BackgroundImage;
  onPictureLoad?: (image: BackgroundImage) => void;
  opacity: number;
  onTransitionEnd?: (image: BackgroundImage) => void;
}

const Image = motion.create(NextImage);

const ImageDisplay: FC<Props> = ({
  bgImage,
  onPictureLoad,
  opacity,
  onTransitionEnd,
}) => {
  const onLoad = () => {
    onPictureLoad?.(bgImage);
  };

  const onImageTransitionEnd = () => {
    onTransitionEnd?.(bgImage);
  };

  return (
    <Image
      animate={{ opacity }}
      style={{ height: SCREEN_HEIGHT }}
      transition={{ duration: 3 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onImageTransitionEnd}
      className="absolute opacity-0"
      src={"/api/" + bgImage.image.fileName}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      alt="Pic of cats"
      onLoad={onLoad}
    />
  );
};

export default ImageDisplay;
