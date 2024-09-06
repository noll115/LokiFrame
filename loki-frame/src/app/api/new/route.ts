import { getImagesNames, imagePath } from "@/utils/ImageUtil";
import { writeFile } from "fs/promises";
import mime from "mime";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  let files = formData.getAll("files[]") as File[];
  for (let file of files) {
    let ext = mime.getExtension(file.type);
    let name = file.name;
    await writeFile(
      `${imagePath}/${Date.now()}.${ext}`,
      Buffer.from(await file.arrayBuffer())
    );
  }
  return Response.json(await getImagesNames());
};
