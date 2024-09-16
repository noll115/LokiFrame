import { PhotoData } from "@/app/edit/add/page";
import { imagePath } from "@/utils/ImageUtil";
import path from "path";
import sharp, { AvailableFormatInfo, OutputInfo, Region } from "sharp";

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 1024;

export const POST = async (req: Request) => {
  const files = (await req.json()) as PhotoData[];
  let waitingFiles: Promise<OutputInfo>[] = [];
  for (let file of files) {
    let crop = file.crop;
    let url = file.dataUrl.split(";base64,").pop()!;
    let buffer = Buffer.from(url, "base64");
    let s = sharp(buffer);
    let cropRegion: Region;
    let { width, height } = await s.metadata();
    console.log(crop, width, height);
    if (!width || !height || !crop)
      return Response.json({ error: "No width or height" }, { status: 500 });
    cropRegion = {
      top: Math.round((crop.y / 100) * height),
      left: Math.round((crop.x / 100) * width),
      height: Math.round((crop.height / 100) * height),
      width: Math.round((crop.width / 100) * width),
    };
    let fileName = file.file.name;
    let extensionSplit = fileName.lastIndexOf(".");
    let [name, type] = fileName.split(fileName[extensionSplit]) as [
      string,
      AvailableFormatInfo
    ];

    waitingFiles.push(
      s
        .extract(cropRegion)
        // .resize({width:SCREEN_WIDTH,height:SCREEN_HEIGHT,fit:"inside"})
        .toFile(path.join(imagePath, name + Date.now() + "." + type))
    );
  }
  await Promise.all(waitingFiles);
  return new Response(null, { status: 200 });
};
