import { IsString, MinLength } from "class-validator";

export class CreateWorkspaceDTO {
  @IsString()
  @MinLength(1)
  name: string;
}
