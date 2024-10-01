import { PhotoData } from "@/app/add/page";
import { addImgs, deleteImgs, getImageData } from "@/utils/dbUtils";
import { NextResponse } from "next/server";

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 1024;

export const POST = async (req: Request) => {
  const files = (await req.json()) as PhotoData[];
  addImgs(files);
  return new Response(null, { status: 200 });
};

export const DELETE = async (req: Request) => {
  let ids = (await req.json()) as number[];
  await deleteImgs(ids);
  return NextResponse.json(await getImageData());
};

export const GET = async () => {
  return NextResponse.json(await getImageData());
};
