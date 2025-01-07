import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config";
import { validate } from "./util/environment.util";
import databaseConfig from "./config/database.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseService } from "./database/database.service";
import { DataSource } from "typeorm";
import { AuthenticationModule } from "./authentication/authentication.module";
import { UserModule } from "./user/user.module";
import { AccessTokenModule } from "./access-token/access-token.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import jwtConfig from "./config/jwt.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: [".env.development.local", ".env.production"],
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      dataSourceFactory: async (options) => {
        return new DataSource(options!).initialize();
      },
    }),
    AuthenticationModule,
    UserModule,
    AccessTokenModule,
    WorkspaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
