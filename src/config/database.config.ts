import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  name: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: process.env.DATABASE_LOGGING === "true",
}));
