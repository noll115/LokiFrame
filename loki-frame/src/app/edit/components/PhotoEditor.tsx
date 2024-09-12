/* eslint-disable @next/next/no-img-element */
import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import type { PhotoData } from "./AddPhotoButton";
import Cropper from "react-easy-crop";

interface Props {
  imagesToUpload: PhotoData[];
}

let aspect = 0.59 / 1;

const PhotoEditor: FC<Props> = ({ imagesToUpload }) => {
  let [selectedImg, setSelectedImg] = useState<PhotoData>(imagesToUpload[0]);
  let [crop, setCrop] = useState({ x: 0, y: 0 });
  let [zoom, setZoom] = useState(1);
  let [showCropper, setShowCropper] = useState(false);
  let cropContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setShowCropper(true);
    }, 200);
  }, []);

  let onImageClick = (newData: PhotoData) => {
    setSelectedImg(newData);
    let hasCrop = newData.crop != null;
    if (hasCrop) {
      setCrop(newData.crop as { x: number; y: number });
    } else {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="relative basis-3/4" ref={cropContainerRef}>
        {showCropper && (
          <Cropper
            image={selectedImg.dataUrl}
            crop={crop}
            initialCroppedAreaPercentages={selectedImg.crop ?? undefined}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(area) => {
              selectedImg.crop = area;
            }}
            onCropAreaChange={() => {
              console.log("CROP");
            }}
          />
        )}
      </div>
      <div className="basis-32 flex gap-1 flex-nowrap overflow-x-scroll">
        {imagesToUpload.map((image) => (
          <ImageReader
            key={image.file.name}
            photoData={image}
            onClick={selectedImg !== image ? onImageClick : undefined}
          />
        ))}
      </div>
    </div>
  );
};

interface IDProps {
  photoData: PhotoData;
  onClick?: (photoData: PhotoData) => void;
}

const ImageReader: FC<IDProps> = ({ photoData, onClick }) => {
  const onImageClick = () => {
    onClick?.(photoData);
  };

  let clickable = onClick !== undefined ? "cursor-pointer" : "";

  return (
    <div className={`group ${clickable}`} onClick={onImageClick}>
      <ImagePreview imageUrl={photoData.dataUrl} />
    </div>
  );
};

export default PhotoEditor;
