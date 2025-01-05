import { registerAs } from "@nestjs/config";

export default registerAs("application", () => ({
  port: parseInt(process.env.PORT!, 10),
  whitelist: process.env.WHITELIST,
}));
