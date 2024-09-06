"use client";

import { createContext, FC, useState } from "react";

export const PhotoContext = createContext<Context>({
  images: [],
  setImages: (images) => {},
});

interface Props {
  children: React.ReactNode;
  initImages: string[];
}

interface Context {
  images: Props["initImages"];
  setImages: (newImages: Props["initImages"]) => void;
}

export default function PhotoProvider({ children, initImages }: Props) {
  const [images, setImages] = useState(initImages);
  return (
    <PhotoContext.Provider value={{ images, setImages }}>
      {children}
    </PhotoContext.Provider>
  );
}
