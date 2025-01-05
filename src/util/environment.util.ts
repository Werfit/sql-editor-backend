/* eslint-disable @typescript-eslint/naming-convention */
import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  validateSync,
} from "class-validator";
import { Logger } from "@nestjs/common";

const logger = new Logger("env.validation");

enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(Environment, {
    message: `NODE_ENV must be one of ${Object.values(Environment).join(", ")}`,
  })
  NODE_ENV: Environment;

  @IsNumberString()
  PORT: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumberString()
  DATABASE_PORT: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsOptional()
  DATABASE_LOGGING?: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsNumberString()
  ACCESS_TOKEN_TTL: string;

  @IsNumberString()
  REFRESH_TOKEN_TTL: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    logger.error(errors.toString(), {
      ...errors.map(
        (error) =>
          `${Object.values(error.constraints!)} | value: ${error.value}`
      ),
    });
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
