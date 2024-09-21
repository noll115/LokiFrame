import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  fileName?: string;
  dataUrl?: string;
}

const ImageDisplay: FC<Props> = ({ fileName, dataUrl }) => {
  const [show, setShow] = useState(false);

  let opacity = show ? "opacity-100 scale-100" : "opacity-0 scale-90";
  let finalUrl = dataUrl ?? "/api/" + fileName;
  return (
    <div
      className={`select-none transition duration-300 rounded-md overflow-hidden ${opacity}`}
    >
      <Image
        src={finalUrl}
        alt={finalUrl}
        width={600}
        height={1024}
        quality={50}
        onLoad={() => setShow(true)}
        className="object-contain"
        placeholder="empty"
      />
    </div>
  );
};

export default ImageDisplay;
