import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  fileName?: string;
  dataUrl?: string;
  isProcessing?: boolean;
}

const ImageDisplay: FC<Props> = ({
  fileName,
  dataUrl,
  isProcessing = false,
}) => {
  const [show, setShow] = useState(isProcessing);

  let opacity = show ? "opacity-100 scale-100" : "opacity-0 scale-90";
  let finalUrl = dataUrl ?? "/api/" + fileName;
  return (
    <div
      className={`select-none h-full transition duration-300 rounded-md overflow-hidden ${opacity}`}
    >
      {isProcessing ? (
        <div className="h-full aspect-[0.59] object-contain flex justify-center items-center flex-col">
          Processing
          <span className="loading loading-spinner" />
        </div>
      ) : (
        <Image
          className="h-full object-contain"
          src={finalUrl}
          alt={finalUrl}
          width={600}
          height={1024}
          quality={50}
          onLoad={() => setShow(true)}
          placeholder="empty"
        />
      )}
    </div>
  );
};

export default ImageDisplay;
