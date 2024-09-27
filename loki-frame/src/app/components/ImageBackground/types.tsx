import { Image } from "@/drizzle/schema";

interface BackgroundImage {
  image: Image;
  loaded: boolean;
  transitioned: boolean;
  index: number;
}

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 1024;

export type { Image };
export { SCREEN_HEIGHT, SCREEN_WIDTH, type BackgroundImage };
