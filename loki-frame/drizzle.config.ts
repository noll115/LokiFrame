import { defineConfig } from "drizzle-kit";
import path from "path";
let dbPath = path.join(
  process.cwd(),
  process.env.DB_PATH as string,
  "sqlite.db"
);

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "file:" + dbPath,
  },
});
