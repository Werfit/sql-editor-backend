import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [],
})
export class AuthenticationModule {}
