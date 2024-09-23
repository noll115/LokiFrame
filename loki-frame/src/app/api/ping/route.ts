import { getConfig, getImageData } from "@/utils/dbUtils";
import { NextRequest, NextResponse } from "next/server";

enum SearchType {
  CONFIG = "config",
  IMAGES = "images",
}

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") as SearchType;

  if (query === "config") {
    let config = await getConfig();
    return NextResponse.json(config);
  } else {
    let images = await getImageData();
    return NextResponse.json(images);
  }
};
