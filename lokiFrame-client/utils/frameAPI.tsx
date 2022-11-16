import { useCallback, useEffect, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";
const URL = __DEV__ ? "http://localhost:8080" : "magicmirror.local";

const useLokiFrameAPI = () => {
  const [imagesFromFrame, setImagesFromFrame] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadNewImages = useCallback(async (newImages: ImagePickerAsset[]) => {
    const data = new FormData();
    console.log(newImages);
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
    const newPhotos: string[] = await res.json();
    console.log(newPhotos);
    setImagesFromFrame(
      newPhotos.map((photoName) => `${URL}/photos/${photoName}`)
    );
  }, []);

  useEffect(() => {
    const getPhotos = async () => {
      let res = await fetch(`${URL}/photos`);
      let data: string[] = await res.json();
      setImagesFromFrame(data.map((photoName) => `${URL}/photos/${photoName}`));
      setIsLoading(true);
    };
    getPhotos();
  }, []);

  return { imagesFromFrame, isLoading, uploadNewImages };
};

export { useLokiFrameAPI };
