"use client";
import { useContext, type FC } from "react";
import ImageTransition from "./ImageTransition";
import { ConnectModal } from "./ConnectModal";
import { ImagesContext } from "../ImagesContext";

interface Props {
  addr: string;
}

const ImageBackground: FC<Props> = ({ addr }) => {
  const { images, config } = useContext(ImagesContext);

  if (images.length == 0) {
    return <ConnectModal addr={addr} />;
  }
  return (
    <div className="size-full">
      <ImageTransition
        timePerPic={config.timePerPic}
        key={images.length}
        images={images}
      />
    </div>
  );
};

export { ImageBackground };
