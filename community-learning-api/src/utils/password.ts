import bcrypt from "bcrypt";
import env from "./env";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.SALT_ROUND);
};

export const verifyPassword = async (
  password: string,
  hash: string,
) => {
  return bcrypt.compare(password, hash);
};
