import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  fileName?: string;
  dataUrl?: string;
  dataBlurUrl?: string;
  isProcessing?: boolean;
}

const ImageDisplay: FC<Props> = ({
  fileName,
  dataUrl,
  isProcessing = false,
  dataBlurUrl,
}) => {
  const [show, setShow] = useState(isProcessing);

  let finalUrl = dataUrl ?? "/api/" + fileName;
  let blurCSS = show ? "backdrop-blur-none" : "backdrop-blur-md";
  return (
    <div className="select-none h-full transition-transform duration-500 rounded-lg overflow-hidden">
      {isProcessing ? (
        <div className="h-full aspect-[0.59] object-contain flex justify-center items-center flex-col">
          Processing
          <span className="loading loading-spinner" />
        </div>
      ) : (
        <>
          <Image
            className="h-full object-contain"
            src={finalUrl}
            alt={finalUrl}
            width={600}
            height={1024}
            quality={50}
            blurDataURL={dataBlurUrl}
            onLoad={() => setShow(true)}
            placeholder={dataBlurUrl ? "blur" : "empty"}
          />
          <div
            className={`absolute transition duration-500 inset-0 rounded-lg ${blurCSS}`}
          ></div>
        </>
      )}
    </div>
  );
};

export default ImageDisplay;
