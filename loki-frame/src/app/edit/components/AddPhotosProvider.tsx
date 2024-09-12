"use client";
import { createContext, useState } from "react";

export const AddPhotoContext = createContext<Context>({
  newPhotos: [],
  setNewPhotos: (images) => {},
});

interface Props {
  children: React.ReactNode;
}

interface Context {
  newPhotos: File[];
  setNewPhotos: (newImages: File[]) => void;
}

export default function AddPhotosProvider({ children }: Props) {
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  return (
    <AddPhotoContext.Provider value={{ newPhotos, setNewPhotos }}>
      {children}
    </AddPhotoContext.Provider>
  );
}
