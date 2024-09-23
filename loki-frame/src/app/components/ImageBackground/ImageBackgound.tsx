import { type FC } from "react";
import ImageTransition from "./NormalState";
import { Image } from "@prisma/client";
import { ConnectModal } from "./ConnentModal";

interface Props {
  images: Image[];
  addr: string;
}

const ImageBackground: FC<Props> = ({ images, addr }) => {
  if (images.length == 0) {
    return <ConnectModal addr={addr} />;
  }
  return (
    <div className="size-full">
      <ImageTransition images={images} />
    </div>
  );
};

export { ImageBackground };
