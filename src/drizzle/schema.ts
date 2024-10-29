import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const imageTable = sqliteTable("image", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  lat: real("lat"),
  long: real("long"),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
  processing: integer("processing", { mode: "boolean" })
    .notNull()
    .default(false),
  blurData: text("blur_data").notNull(),
});

export const configTable = sqliteTable("config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  showClock: integer("show_clock", { mode: "boolean" })
    .default(false)
    .notNull(),
  timePerPic: integer("time_per_pic").default(15000).notNull(),
  brightness: integer().default(10).notNull(),
  configUpdateTime: integer("config_update_time")
    .default(sql`(unixepoch())`)
    .notNull(),
  imagesUpdateTime: integer("images_update_time")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export type Image = typeof imageTable.$inferSelect;
export type InsertImage = typeof imageTable.$inferInsert;
export type Config = typeof configTable.$inferSelect;
export type InsertConfig = typeof configTable.$inferInsert;
