"use server";

import { InsertConfig } from "@/drizzle/schema";
import { UpdateConfig } from "@/utils/dbUtils";
export const settingsAction = async (newConfig: InsertConfig) => {
  await UpdateConfig(newConfig);
};
