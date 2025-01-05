import { Injectable } from "@nestjs/common";
import { compare, encrypt } from "src/util/encryption.util";
import {
  CreateUserFields,
  UserCredentialsFields,
  UserPayload,
  UserUniqueFields,
} from "./user.types";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async exists(data: Partial<UserUniqueFields>) {
    const count = await this.usersRepository.count({
      where: data,
    });

    return count >= 1;
  }

  async verifyCredentials(
    data: UserCredentialsFields
  ): Promise<UserPayload | null> {
    const user = await this.usersRepository.findOne({
      where: {
        email: data.email,
      },
      select: ["id", "email", "password"],
    });

    if (!user) {
      return null;
    }

    if (await compare(user.password, data.password)) {
      return {
        id: user.id,
        email: user.email,
      };
    }

    return null;
  }

  async create(data: CreateUserFields, options?: { hidePassword: boolean }) {
    const password = await encrypt(data.password);

    const user = this.usersRepository.create({
      ...data,
      password,
    });

    const userInstance = await this.usersRepository.save(user);
    if (options?.hidePassword) {
      const { password, ...userWithoutPassword } = userInstance;
      return userWithoutPassword;
    }

    return userInstance;
  }

  async updateSession(id: User["id"], refreshToken: string | null) {
    return await this.usersRepository.update(
      {
        id,
      },
      {
        session: refreshToken,
      }
    );
  }

  async findOneBy(fields: Partial<UserUniqueFields>) {
    return this.usersRepository.findOneBy(fields);
  }
}
