import { useCallback, useEffect, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
const URL = __DEV__ ? "http://localhost:8080" : "magicmirror.local";

enum FrameState {
  IDLE,
  LOADING,
}
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

  const [state, setState] = useState(FrameState.IDLE);

  const uploadNewImages = useCallback(async (newImages: ImagePickerAsset[]) => {
    const data = new FormData();
    setState(FrameState.LOADING);
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
    setState(FrameState.IDLE);
  }, []);

  useEffect(() => {
    const getPhotos = async () => {
      setState(FrameState.LOADING);
      let res = await fetch(`${URL}/photos`);
      let newphotos = createURILinks(await res.json());
      setImages(newphotos);
      setState(FrameState.IDLE);
    };
    getPhotos();
  }, []);

  const toggleImageDelete = useCallback((index: number) => {
    setImages((prevImages) => {
      let prevVal = prevImages[index].toDelete;
      prevImages[index].toDelete = !prevVal;
      return [...prevImages];
    });
  }, []);

  const resetImages = useCallback(() => {
    setImages((prevImages) =>
      prevImages.map((data) => ({ ...data, toDelete: false }))
    );
  }, []);

  const confirmDelete = useCallback(async () => {
    const imagesToDelete = [];
    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      if (element.toDelete) imagesToDelete.push(element.fileName);
    }
    setState(FrameState.LOADING);
    await fetch(`${URL}/photos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imagesToDelete),
    });
    setImages((prevImages) => prevImages.filter((data) => !data.toDelete));
    setState(FrameState.IDLE);
  }, [images]);

  return {
    images,
    uploadNewImages,
    toggleImageDelete,
    resetImages,
    confirmDelete,
    isLoading: state === FrameState.LOADING,
  };
};

export { useLokiFrameAPI, ImageData };
