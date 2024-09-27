"use client";
import { FC, useEffect, useRef, useState } from "react";
import ImageDisplay from "./ImageDisplay";
import { AnimatePresence } from "framer-motion";
import { BackgroundImage } from "./types";
import { Image } from "@/drizzle/schema";

const getNextImageIndex = (arr: any[], currIndex: number) => {
  return (currIndex + 1) % arr.length;
};

interface Props {
  images: Image[];
  timePerPic: number;
}

const ImageTransition: FC<Props> = ({ images, timePerPic }) => {
  let timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const [imagesArr, setImagesArr] = useState<BackgroundImage[]>([
    { image: images[0], index: 0, loaded: true, transitioned: false },
    {
      image: images[getNextImageIndex(images, 0)],
      index: getNextImageIndex(images, 0),
      loaded: false,
      transitioned: false,
    },
  ]);

  useEffect(() => {
    return () => {
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current);
      }
    };
  }, []);

  const switchPics = () => {
    imagesArr.shift();

    let currImage = imagesArr[0];
    let nextIndex = getNextImageIndex(images, currImage.index);
    setImagesArr([
      currImage,
      {
        image: images[nextIndex],
        index: nextIndex,
        loaded: false,
        transitioned: false,
      },
    ]);
    timeOutRef.current = null;
  };

  const startTimeout = () => {
    if (imagesArr.length != 2) return;
    if (!imagesArr[0].transitioned || !imagesArr[1].loaded) return;
    if (!timeOutRef.current) {
      timeOutRef.current = setTimeout(switchPics, timePerPic);
    }
  };

  const onPictureLoad = async (image: BackgroundImage) => {
    image.loaded = true;
    startTimeout();
  };

  const onPictureTransitioned = async (image: BackgroundImage) => {
    if (image.transitioned) return;
    image.transitioned = true;
    startTimeout();
  };

  return (
    <AnimatePresence>
      {imagesArr.map((bgImage, i) => {
        let opacity = i == 0 ? 1 : 0;
        return (
          <ImageDisplay
            key={bgImage.image.fileName + i}
            bgImage={bgImage}
            opacity={opacity}
            onPictureLoad={onPictureLoad}
            onTransitionEnd={i == 0 ? onPictureTransitioned : undefined}
          />
        );
      })}
    </AnimatePresence>
  );
};

export default ImageTransition;
