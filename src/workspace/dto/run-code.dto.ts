import { IsString, IsUUID, MinLength } from "class-validator";

export class RunCodeDTO {
  @IsUUID()
  workspaceId: string;

  @IsString()
  @MinLength(1)
  code: string;
}
