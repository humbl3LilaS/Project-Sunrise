import type { ZodError } from "zod";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const EnvSchema = z.object({
  ENV: z.string().default("PROD"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z.string(),
});

type TEnv = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: TEnv;

try {
// eslint-disable-next-line node/prefer-global/process
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("Error Parsing Invalid Env Variables:");
  console.error(error.format());
}

export default env;
