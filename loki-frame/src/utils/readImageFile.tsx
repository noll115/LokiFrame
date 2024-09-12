import { useEffect, useState } from "react";

interface ImageFileData {
  file: File;
  dataUrl: string;
}

const readImageFile = (file: File) => {
  return new Promise<ImageFileData>((res, rej) => {
    let reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        res({ file, dataUrl: reader.result as string });
      }
    };
    reader.onerror = () => {
      rej(reader.error);
    };
    reader.readAsDataURL(file);
  });
};

export { readImageFile, type ImageFileData };
