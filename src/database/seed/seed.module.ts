import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import databaseConfig from "src/config/database.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseService } from "../database.service";
import { DataSource } from "typeorm";
import { SchemaSeedService } from "./services/schema.service";
import { SeedService } from "./seed.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      envFilePath: [".env.development.local", ".env.production"],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
      dataSourceFactory: async (options) => {
        return new DataSource(options!).initialize();
      },
    }),
  ],
  providers: [SeedService, SchemaSeedService],
})
export class SeedModule {}
