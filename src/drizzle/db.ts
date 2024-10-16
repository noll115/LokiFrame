import { drizzle } from "drizzle-orm/libsql";
import path from "path";
import * as schema from "./schema";
import {
  configTable,
  InsertImage,
  imageTable,
  InsertConfig,
} from "@/drizzle/schema";
import { desc, eq, inArray } from "drizzle-orm";

let dbPath = path.join(process.cwd(), process.env.DB_PATH ?? "db", "sqlite.db");

export const db = drizzle("file:" + dbPath, { schema });

export const getImages = () =>
  db.select().from(imageTable).orderBy(desc(imageTable.createdAt));

export const insertImages = async (newImages: InsertImage[]) =>
  await db
    .insert(imageTable)
    .values(newImages)
    .returning({ id: imageTable.id, fileName: imageTable.fileName });

export const updateImage = async (id: number, image: Partial<InsertImage>) =>
  await db.update(imageTable).set(image).where(eq(imageTable.id, id));

export const insertImage = async (newImage: InsertImage) => {
  let img = await db
    .insert(imageTable)
    .values(newImage)
    .returning({ id: imageTable.id });
  return img[0];
};

export const deleteImages = async (ids: number[]) => {
  let res = await db
    .delete(imageTable)
    .where(inArray(imageTable.id, ids))
    .returning({ fileName: imageTable.fileName });
  return res;
};

export const getConfig = async () => {
  let res = await db.select().from(configTable).where(eq(configTable.id, 0));
  if (res.length == 0) {
    res = await db.insert(configTable).values({ id: 0 }).returning();
  }
  return res[0];
};

export const updateConfig = async (data: InsertConfig) => {
  await db
    .update(configTable)
    .set({ ...data, configUpdateTime: Date.now() })
    .where(eq(configTable.id, 0));
};
