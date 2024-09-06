import { imagePath } from "@/utils/ImageUtil";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let imageId = params.id;
  if (!imageId) {
    return NextResponse.json({}, { status: 404 });
  }

  let imageFile = path.join(imagePath, imageId);
  try {
    let imageData = fs.readFileSync(imageFile);
    let response = new NextResponse(imageData);
    response.headers.set("Content-Type", "image/jpg");
    return response;
  } catch (e) {
    return NextResponse.json({}, { status: 404 });
  }
}
