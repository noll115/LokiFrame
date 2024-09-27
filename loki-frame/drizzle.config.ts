import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: "file:./src/drizzle/db/sqlite.db",
  },
});
