import path from "path";
import fs from "fs";

const imagePath = path.join(process.cwd(), "photos");

const getImagesNames = async () => {
  console.log(imagePath);
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }
  let images = fs.readdirSync(imagePath).map((img) => "/api/" + img);
  return images;
};

export { getImagesNames, imagePath };
