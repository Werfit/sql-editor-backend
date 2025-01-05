import { Global, Module } from "@nestjs/common";
import { AccessTokenService } from "./access-token.service";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  providers: [
    {
      provide: AccessTokenService,
      useFactory: (configService: ConfigService) => {
        return new AccessTokenService({
          accessSecret: configService.getOrThrow("jwt.accessToken"),
          refreshSecret: configService.getOrThrow("jwt.refreshToken"),
          accessTTL: configService.getOrThrow("jwt.accessTTL"),
          refreshTTL: configService.getOrThrow("jwt.refreshTTL"),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
