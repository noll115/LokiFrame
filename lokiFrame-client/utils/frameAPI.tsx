import { useCallback, useEffect, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
const URL = __DEV__ ? "http://localhost:8080" : "magicmirror.local";

interface ImageData {
  uri: string;
  toDelete: boolean;
}

const createURILinks = (uriArray: string[]): ImageData[] => {
  return uriArray.map((uri) => ({
    uri: `${URL}/photos/${uri}`,
    toDelete: false,
  }));
};

const useLokiFrameAPI = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  const uploadNewImages = async (newImages: ImagePickerAsset[]) => {
    const data = new FormData();
    for (const image of newImages) {
      if (!image.fileName) {
        image.fileName = new Date().toString();
      }
      data.append("photos", {
        name: image.fileName,
        type: image.type!,
        uri: image.uri.replace("file://", ""),
      } as any);
    }
    let res = await fetch(`${URL}/photos`, {
      method: "POST",
      body: data,
    });
    let newPhotos = createURILinks(await res.json());
    console.log(newPhotos);
    setImages(newPhotos);
  };

  useEffect(() => {
    const getPhotos = async () => {
      let res = await fetch(`${URL}/photos`);
      let newphotos = createURILinks(await res.json());
      setImages(newphotos);
    };
    getPhotos();
  }, []);

  const toggleImageDelete = (index: number) => {
    return () =>
      setImages((prevImages) => {
        let prevVal = prevImages[index].toDelete;
        prevImages[index].toDelete = !prevVal;
        return [...prevImages];
      });
  };

  const resetImages = () => {
    setImages((prevImages) =>
      prevImages.map(({ uri }) => ({ uri, toDelete: false }))
    );
  };

  return { images, uploadNewImages, toggleImageDelete, resetImages };
};

export { useLokiFrameAPI, ImageData };
