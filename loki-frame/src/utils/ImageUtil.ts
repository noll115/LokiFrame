import path from "path";
import fs from "fs";
import fsp from "fs/promises";

const imagePath = path.join(process.cwd(), "photos");

const getImagesNames = async () => {
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }
  let images = fs.readdirSync(imagePath).map((img) => "/api/" + img);
  return images;
};

const deleteImg = async (image: string) => {
  return await fsp.rm(path.join(imagePath, image));
};

const getImageTest = async () => {
  return [
    "https://picsum.photos/seed/loki/600/1024",
    "https://picsum.photos/seed/gatito/600/1024",
    "https://picsum.photos/seed/burrito/600/1024",
  ];
};

export { getImagesNames, imagePath, getImageTest, deleteImg };
