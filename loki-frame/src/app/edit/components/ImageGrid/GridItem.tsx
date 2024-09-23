import { FC, RefObject, useEffect, useRef, useState } from "react";
import ImageDisplay from "../ImageDisplay";
import { TbTrash } from "react-icons/tb";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@prisma/client";

interface Props {
  isMobile: boolean;
  image: Image;
  onClick: (id: string, deleting: boolean) => void;
  containerRef: RefObject<HTMLDivElement>;
}

export const ImageGridItem = ({
  isMobile,
  containerRef,
  ...imageProps
}: Props) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef,
    offset: ["20% end", "end end"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  let ImageContainer = isMobile ? DeletableImageMobile : DeletableImage;
  return (
    <motion.div
      layout
      style={{ opacity, scale }}
      exit={{ opacity: 0 }}
      className="relative group"
      ref={targetRef}
    >
      <ImageContainer {...imageProps} />
    </motion.div>
  );
};

interface DeletableProps extends Omit<Props, "isMobile" | "containerRef"> {}

const DeletableImage = ({ image, onClick }: DeletableProps) => {
  const [deleting, setDeleting] = useState(false);

  const onToggle = () => {
    onClick(image.id, !deleting);
    setDeleting(!deleting);
  };

  return (
    <>
      <ImageDisplay fileName={image.fileName} />
      {deleting ? (
        <div className="size-full flex justify-center items-center backdrop-blur-[2px] absolute top-0 left-0">
          <button
            className="btn text-5xl text-red-500 hover:scale-110 bg-black/20 rounded-box p-2 h-min btn-ghost"
            onClick={onToggle}
          >
            <TbTrash />
          </button>
        </div>
      ) : (
        <div className="size-full flex hover:backdrop-blur-[2px] justify-center items-center duration-300 opacity-0 group-hover:opacity-100 transition absolute top-0 left-0">
          <button
            className="btn bg-secondary border-none drop-shadow-md rounded-box p-2 h-min text-3xl"
            onClick={onToggle}
          >
            <TbTrash />
          </button>
        </div>
      )}
    </>
  );
};

const HOLD_LENGTH = 300;

const DeletableImageMobile = ({ image, onClick }: DeletableProps) => {
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const onToggle = () => {
    onClick(image.id, !deleting);
    setDeleting(!deleting);
  };

  const onLongTouch = () => {
    timerRef.current = setTimeout(onToggle, HOLD_LENGTH);
  };

  const onEndTouch = () => {
    clearTimeout(timerRef.current);
  };

  return (
    <motion.div
      className="relative"
      animate={{ scale: deleting ? 0.95 : 1 }}
      transition={{ type: "spring", duration: 0.8, bounce: 0.7 }}
      onTouchStart={onLongTouch}
      onTouchEnd={onEndTouch}
      onTouchMove={onEndTouch}
    >
      <ImageDisplay fileName={image.fileName} />
      {deleting && (
        <div className="size-full flex justify-center items-center backdrop-blur-[2px] absolute top-0 left-0">
          <button
            className="btn text-5xl text-red-500 bg-black/20 rounded-box p-2 h-min btn-ghost"
            onTouchStart={onToggle}
          >
            <TbTrash />
          </button>
        </div>
      )}
    </motion.div>
  );
};
