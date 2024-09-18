"use client";

import { FC, useContext, useEffect, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import { TbTrash } from "react-icons/tb";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export default function ImageGrid({
  serverImages,
  isMobile,
}: {
  serverImages: string[];
  isMobile: boolean;
}) {
  const [imagesDeleting, setImagesDeleting] = useState<string[]>([]);
  const [images, setImages] = useState(serverImages);
  const [pending, setPending] = useState(false);

  const onImageClick = (imgUrl: string, deleting: boolean) => {
    if (deleting) {
      setImagesDeleting([...imagesDeleting, imgUrl]);
    } else {
      setImagesDeleting(imagesDeleting.filter((url) => url != imgUrl));
    }
  };

  const onDeleteImages = async () => {
    setPending(true);

    let res = await fetch("api/edit", {
      body: JSON.stringify(imagesDeleting),
      method: "DELETE",
    });

    setImages(await res.json());
    setPending(false);
    setImagesDeleting([]);
  };

  return (
    <>
      <div className="size-full overflow-y-auto">
        <div className="grid grid-cols-4 md:grid-cols-5 gap-1 max-w-max pointer pb-16">
          <AnimatePresence>
            {images.map((imgUrl) =>
              isMobile ? (
                <DeletableImageMobile
                  key={imgUrl}
                  imgUrl={imgUrl}
                  onClick={onImageClick}
                />
              ) : (
                <DeletableImage
                  key={imgUrl}
                  imgUrl={imgUrl}
                  onClick={onImageClick}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {imagesDeleting.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="flex pb-5 justify-center w-full fixed bottom-0 "
          >
            <button
              className="btn btn-lg btn-error font-bold btn-wide rounded-box"
              onClick={onDeleteImages}
              disabled={pending}
            >
              Delete {pending && <span className="loading loading-spinner" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const HOLD_LENGTH = 300;

const DeletableImageMobile: FC<DeletableProps> = ({ imgUrl, onClick }) => {
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const onToggle = () => {
    onClick(imgUrl, !deleting);
    setDeleting(!deleting);
  };

  const onLongTouch = () => {
    timerRef.current = setTimeout(onToggle, HOLD_LENGTH);
  };

  const onEndTouch = () => clearTimeout(timerRef.current);

  return (
    <motion.div layout exit={{ opacity: 0 }}>
      <motion.div
        className="relative"
        animate={{ scale: deleting ? 0.95 : 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.7 }}
        onTouchStart={onLongTouch}
        onTouchEnd={onEndTouch}
      >
        <ImagePreview imageUrl={imgUrl} />
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
    </motion.div>
  );
};

interface DeletableProps {
  imgUrl: string;
  onClick: (imgUrl: string, deleting: boolean) => void;
}

const DeletableImage: FC<DeletableProps> = ({ imgUrl, onClick }) => {
  const [deleting, setDeleting] = useState(false);

  const onToggle = () => {
    onClick(imgUrl, !deleting);
    setDeleting(!deleting);
  };

  return (
    <motion.div layout exit={{ opacity: 0 }} className="relative group">
      <ImagePreview imageUrl={imgUrl} />
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
    </motion.div>
  );
};
