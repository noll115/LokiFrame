import { Dispatch, FC, forwardRef, useContext, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { PhotoData } from "./page";
import { AnimatePresence, motion } from "framer-motion";
import ImageList from "./ImageList";
import { FaUpload } from "react-icons/fa";
import { ImageContext } from "./ImageContext";

let aspect = 0.59 / 1;
interface Props {
  onClose: () => void;
  setLoading: Dispatch<boolean>;
}
const PhotoEditor = ({ onClose, setLoading }: Props) => {
  let [currentIndex, setCurrentIndex] = useState(0);
  let cropContainerRef = useRef<HTMLDivElement>(null);
  let images = useContext(ImageContext);

  const onNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <>
      <div className="flex flex-col size-full">
        <div
          className="relative basis-3/4"
          ref={cropContainerRef}
        >
          <AnimatePresence mode="popLayout">
            <ImageCropper
              key={currentIndex}
              currentIndex={currentIndex}
              images={images}
            />
          </AnimatePresence>
        </div>
        <div className="basis-32 w-full mt-3">
          <ImageList
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            images={images}
          />
        </div>
      </div>
      {currentIndex < images.length - 1 ? (
        <NextPhotoBtn onNext={onNext} />
      ) : (
        <UploadBtn
          setLoading={setLoading}
          images={images}
          onClose={onClose}
        />
      )}
    </>
  );
};

const ImageCropper = forwardRef<
  HTMLDivElement,
  { currentIndex: number; images: PhotoData[] }
>(function ImageCropper({ currentIndex, images }, ref) {
  let [crop, setCrop] = useState({ x: 0, y: 0 });
  let [zoom, setZoom] = useState(1);
  let currentPhoto = images[currentIndex];
  return (
    <motion.div
      ref={ref}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Cropper
        image={currentPhoto.dataUrl}
        crop={crop}
        initialCroppedAreaPercentages={currentPhoto.crop ?? undefined}
        zoom={zoom}
        aspect={aspect}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(area) => {
          currentPhoto.crop = area;
        }}
      />
    </motion.div>
  );
});

const NextPhotoBtn: FC<{ onNext: () => void }> = ({ onNext }) => (
  <BottomBtn
    onClick={onNext}
    className="btn-primary"
  >
    Next
  </BottomBtn>
);
interface UploadProps {
  onClose: () => void;
  images: PhotoData[];
  setLoading: Dispatch<boolean>;
}
const UploadBtn = ({ onClose, images, setLoading }: UploadProps) => {
  const submitFiles = async () => {
    setLoading(true);
    await fetch("/api/edit", {
      body: JSON.stringify(images),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    onClose();
  };

  return (
    <BottomBtn
      onClick={submitFiles}
      className="bg-primary"
    >
      Upload <FaUpload className="text-2xl" />
    </BottomBtn>
  );
};
interface BottomBtnProps {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
}
const BottomBtn: FC<BottomBtnProps> = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`btn btn-lg rounded-box text-2xl w-full md:w-[30vw]  ${className}`}
  >
    {children}
  </button>
);

export default PhotoEditor;
