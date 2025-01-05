import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const encrypt = async (data: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(data, salt);
};

export const compare = async (hash: string, data: string): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};
