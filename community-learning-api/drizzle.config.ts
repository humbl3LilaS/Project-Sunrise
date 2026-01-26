import { defineConfig } from "drizzle-kit";

import env from "./src/utils/env";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema.ts", "./src/db/enum.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
