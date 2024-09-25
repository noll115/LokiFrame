import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { connection, db } from "./db";

const migrateFunc = async () => {
  // This will run migrations on the database, skipping the ones already applied
  migrate(db, { migrationsFolder: "src/drizzle/migrations" });
  // Don't forget to close the connection, otherwise the script will hang
  connection.close();
};

migrateFunc();
