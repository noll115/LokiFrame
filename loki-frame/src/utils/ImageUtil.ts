import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { PhotoData } from "@/app/edit/add/page";
import sharp, { AvailableFormatInfo } from "sharp";
import exifReader, { Exif } from "exif-reader";
import { PrismaClient } from "@prisma/client";

const imagePath = path.join(process.cwd(), "photos");

const getImagesNames = async () => {
  const prisma = new PrismaClient();
  if (!fs.existsSync(imagePath)) {
    await fsp.mkdir(imagePath);
  }
  return await prisma.image.findMany();
};

type GPSData = {
  long: number;
  lat: number;
};
const addImg = async (photoData: PhotoData) => {
  let crop = photoData.crop;
  let url = photoData.dataUrl.split(";base64,").pop()!;
  let buffer = Buffer.from(url, "base64");
  let s = sharp(buffer);

  let { width, height, exif } = await s.metadata();
  let gpsData: GPSData | null = null;
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
  let output = await s.extract(cropRegion).toFile(filePath);
  const prisma = new PrismaClient();
  await prisma.image.create({
    data: {
      fileName,
      lat: gpsData?.lat,
      long: gpsData?.long,
    },
  });
  return output;
};

const dms2dd = ([degrees, minutes, seconds]: number[], direction: string) => {
  let dd = degrees + minutes / 60 + (seconds / 60) * 60;
  if (direction === "E" || direction === "S") {
    dd *= -1;
  }
  return dd;
};

const deleteImg = async (id: string) => {
  const prisma = new PrismaClient();
  let deletedImg = await prisma.image.delete({ where: { id } });
  return await fsp.rm(path.join(imagePath, deletedImg.fileName));
};

const getImageTest = async () => {
  return [
    "https://picsum.photos/seed/loki/600/1024",
    "https://picsum.photos/seed/gatito/600/1024",
    "https://picsum.photos/seed/burrito/600/1024",
  ];
};

export { getImagesNames, imagePath, getImageTest, deleteImg, addImg };
