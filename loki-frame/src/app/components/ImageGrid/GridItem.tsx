import {
  DOMAttributes,
  FC,
  RefObject,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import ImageDisplay from "../ImageDisplay";
import { TbTrash } from "react-icons/tb";
import {
  HTMLMotionProps,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Image } from "@/drizzle/schema";

interface Props {
  isMobile: boolean;
  image: Image;
  onClick: (id: number, deleting: boolean) => void;
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
  let isProcessing = image.processing;
  const onToggle = () => {
    onClick(image.id, !deleting);
    setDeleting(!deleting);
  };

  const hoverBtn = isProcessing ? null : (
    <div className="size-full flex hover:backdrop-blur-[2px] justify-center items-center duration-300 opacity-0 group-hover:opacity-100 transition absolute top-0 left-0">
      <button
        className="btn btn-error border-none drop-shadow-md rounded-box p-2 h-min text-3xl"
        onClick={onToggle}
      >
        <TbTrash />
      </button>
    </div>
  );

  return (
    <>
      <ImageDisplay
        fileName={image.fileName}
        isProcessing={image.processing}
      />
      {deleting ? <RemoveDeleteBtn onClick={onToggle} /> : hoverBtn}
    </>
  );
};

const HOLD_LENGTH = 300;

const DeletableImageMobile = ({ image, onClick }: DeletableProps) => {
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const isProcessing = image.processing;

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
      onTouchStart={isProcessing ? undefined : onLongTouch}
      onTouchEnd={onEndTouch}
      onTouchMove={onEndTouch}
    >
      <ImageDisplay
        fileName={image.fileName}
        isProcessing={image.processing}
      />
      {deleting && <RemoveDeleteBtn onClick={onToggle} />}
    </motion.div>
  );
};

const RemoveDeleteBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="inset-0 flex justify-center items-center backdrop-blur-[2px] absolute ">
      <button
        className="btn btn-ghost bg-neutral bg-opacity-30 text-error text-5xl p-2 h-min"
        onClick={onClick}
      >
        <TbTrash />
      </button>
    </div>
  );
};
