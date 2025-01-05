import { DeepPartial } from "typeorm";
import { User } from "./user.entity";

export type UserUniqueFields = Pick<User, "id" | "email"> & {
  session?: string;
};

export type UserCredentialsFields = Pick<User, "email" | "password">;

export type UserPayload = Pick<User, "id" | "email">;

export type CreateUserFields = DeepPartial<User> & Pick<User, "password">;
