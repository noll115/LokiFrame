import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { PhotoData } from "@/app/add/page";
import sharp from "sharp";
import exifReader from "exif-reader";
import { InsertConfig } from "@/drizzle/schema";
import * as db from "../drizzle/db";

const imagePath = path.join(process.cwd(), "photos");

const getImageData = async () => {
  if (!fs.existsSync(imagePath)) {
    await fsp.mkdir(imagePath);
  }
  return await db.getImages();
};

type GPSData = null | {
  long: number;
  lat: number;
};

const addImg = async (photoData: PhotoData) => {
  let crop = photoData.crop;
  let url = photoData.dataUrl.split(";base64,").pop()!;
  let buffer = Buffer.from(url, "base64");
  let s = sharp(buffer);

  let { width, height, exif } = await s.metadata();
  let gpsData: GPSData = null;
  if (exif) {
    let { GPSInfo } = exifReader(exif);
    if (GPSInfo) {
      gpsData = {
        lat: dms2dd(GPSInfo.GPSLatitude!, GPSInfo.GPSLatitudeRef!),
        long: dms2dd(GPSInfo.GPSLongitude!, GPSInfo.GPSLongitudeRef!),
      };
    }
  }

  if (!width || !height || !crop)
    throw Response.json({ error: "No width or height" }, { status: 500 });

  let cropRegion = {
    top: Math.round((crop.y / 100) * height),
    left: Math.round((crop.x / 100) * width),
    height: Math.round((crop.height / 100) * height),
    width: Math.round((crop.width / 100) * width),
  };

  let currentTime = Date.now();
  let extensionSplit = photoData.fileName.lastIndexOf(".");
  let [name, type] = photoData.fileName.split(
    photoData.fileName[extensionSplit]
  );
  let fileName = name + currentTime + "." + type;
  let filePath = path.join(imagePath, fileName);
  let output = await s
    .extract(cropRegion)
    .resize({ width: 700, height: 1024, fit: "inside" })
    .toFile(filePath);
  await db.insertImage({ fileName, lat: gpsData?.lat, long: gpsData?.long });
  await UpdateConfig({ imagesUpdateTime: Date.now() });
  return output;
};

const dms2dd = ([degrees, minutes, seconds]: number[], direction: string) => {
  let dd = degrees + minutes / 60 + (seconds / 60) * 60;
  if (direction === "E" || direction === "S") {
    dd *= -1;
  }
  return dd;
};

const deleteImg = async (id: number) => {
  let deletedImg = await db.deleteImage(id);
  await UpdateConfig({ imagesUpdateTime: Date.now() });
  return await fsp.rm(path.join(imagePath, deletedImg.fileName));
};

const getConfig = async () => {
  return await db.getConfig();
};

const UpdateConfig = async (data: InsertConfig) => {
  db.updateConfig(data);
};

export { getImageData, imagePath, deleteImg, addImg, getConfig, UpdateConfig };
