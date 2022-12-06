import { useCallback, useEffect, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
const URL = __DEV__ ? "http://localhost:8080" : "magicmirror.local";

interface ImageData {
  uri: string;
  toDelete: boolean;
  fileName: string;
}

const createURILinks = (fileNames: string[]): ImageData[] => {
  return fileNames.map((fileName) => ({
    uri: `${URL}/photos/${fileName}`,
    toDelete: false,
    fileName,
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
    console.log(newPhotos.map((val) => val.uri));
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
      prevImages.map((data) => ({ ...data, toDelete: false }))
    );
  };

  const confirmDelete = async () => {
    const imagesToDelete = [];
    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      if (element.toDelete) imagesToDelete.push(element.fileName);
    }
    await fetch(`${URL}/photos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imagesToDelete),
    });
    setImages((prevImages) => prevImages.filter((data) => !data.toDelete));
  };

  return {
    images,
    uploadNewImages,
    toggleImageDelete,
    resetImages,
    confirmDelete,
  };
};

export { useLokiFrameAPI, ImageData };
