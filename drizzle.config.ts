import { defineConfig } from "drizzle-kit";
import path from "path";
let dbPath = path.join(process.cwd(), process.env.DB_PATH ?? "db", "sqlite.db");

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "sqlite",
  verbose: true,
  dbCredentials: {
    url: "file:" + dbPath,
  },
});
