import { IsString } from "class-validator";

export class RefreshTokenRequestDTO {
  @IsString()
  refreshToken: string;
}
