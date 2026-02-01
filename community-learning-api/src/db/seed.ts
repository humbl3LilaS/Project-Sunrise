import { hashPassword } from "@utils/password";
import { prettyPino } from "@utils/pino-logger";
import { db } from "./drizzle";
import { users } from "./schema";

const mockUsers = [
  { email: "sabishinekobebe@gmail.com", name: "Edelweiss", age: 25 },
  { email: "supertomatoe@gmail.com", name: "Super Tomatoe", age: 22 },
  { email: "duperpotatoe@gmail.com", name: "Duper Potatoe", age: 24 },

];

const logger = prettyPino();

export const seed = async () => {
  logger.info("Seeding Start...");
  await db.delete(users);
  const hashedPW = await hashPassword("P@ssword123!");

  for (const user of mockUsers) {
    await db.insert(users).values({ ...user, password: hashedPW });
  }

  logger.info("Seeding End...");
};

if (import.meta.main) {
  seed().catch((err) => {
    logger.fatal("ERROR During seeding process.");
    logger.fatal(err);
    process.exit(1);
  });
}
