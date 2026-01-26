import { pinoLogger } from "hono-pino";
import { pino } from "pino";
import pretty from "pino-pretty";
import env from "./env";

export const cPinoLogger = () => {
  return pinoLogger({
    pino: pino({
      level: env.LOG_LEVEL || "info",
    }, env.ENV === "PROD" ? undefined : pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
};
