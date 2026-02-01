import type { ZodError } from "zod";
import path from "node:path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.ENV === "test" ? ".env.test" : ".env",
  ),
}));

const EnvSchema = z.object({
  ENV: z.string().default("PROD"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "slient"]).default("info"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SALT_ROUND: z.coerce.number().positive(),
});

type TEnv = z.infer<typeof EnvSchema>;

let env: TEnv;

try {
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("Error Parsing Invalid Env Variables:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
