import Image from "next/image";
import { FC, useState } from "react";

interface Props {
  imageUrl: string;
}

const ImagePreview: FC<Props> = ({ imageUrl }) => {
  const [show, setShow] = useState(false);

  let opacity = show ? "opacity-100 scale-100" : "opacity-0 scale-90";

  return (
    <div
      className={`select-none object-contain transition duration-300 ${opacity}`}
    >
      <Image
        src={imageUrl}
        alt={imageUrl}
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

export default ImagePreview;
