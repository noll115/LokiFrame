import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import * as schema from "./schema";
import {
  configTable,
  InsertImage,
  imageTable,
  InsertConfig,
} from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

let dbPath = path.join(process.cwd(), "src/drizzle/db/sqlite.db");

export const connection = new Database(dbPath);
export const db = drizzle(connection, { schema });

export const getImages = () =>
  db.select().from(imageTable).orderBy(desc(imageTable.createdAt));

export const insertImage = async (newImage: InsertImage) =>
  await db.insert(imageTable).values(newImage);

export const deleteImage = async (id: number) => {
  let res = await db
    .delete(imageTable)
    .where(eq(imageTable.id, id))
    .returning();
  return res[0];
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
