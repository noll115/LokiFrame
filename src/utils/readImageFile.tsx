interface ImageFileData {
  file: File;
  dataUrl: string;
  fileName: string;
}

const readImageFile = (file: File, fileName: string) => {
  return new Promise<ImageFileData>((res, rej) => {
    let reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        res({ file, fileName, dataUrl: reader.result as string });
      }
    };
    reader.onerror = () => {
      rej(reader.error);
    };
    reader.readAsDataURL(file);
  });
};

export { readImageFile, type ImageFileData };
