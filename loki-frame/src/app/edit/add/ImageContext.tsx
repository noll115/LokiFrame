import { createContext } from "react";
import { PhotoData } from "./page";

export const ImageContext = createContext<PhotoData[]>([]);

interface Props {
  images: PhotoData[];
  children: React.ReactNode;
}

export function ImageProvider({ images, children }: Props) {
  return (
    <ImageContext.Provider value={images}>{children}</ImageContext.Provider>
  );
}
