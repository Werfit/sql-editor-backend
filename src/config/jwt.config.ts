import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
  accessToken: process.env.ACCESS_TOKEN_SECRET,
  refreshToken: process.env.REFRESH_TOKEN_SECRET,
  accessTTL: parseInt(process.env.ACCESS_TOKEN_TTL!, 10),
  refreshTTL: parseInt(process.env.REFRESH_TOKEN_TTL!, 10),
}));
