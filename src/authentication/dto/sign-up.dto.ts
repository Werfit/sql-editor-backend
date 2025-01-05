import { IsEmail, IsString, Matches } from "class-validator";

export class SignUpRequestDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string;
}
