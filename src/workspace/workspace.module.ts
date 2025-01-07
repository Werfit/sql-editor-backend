import { Module } from "@nestjs/common";
import { WorkspaceController } from "./workspace.controller";
import { WorkspaceService } from "./workspace.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity";
import { UserModule } from "src/user/user.module";
import { SqlExecutionerService } from "src/sql-executioner/sql-executioner.service";

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), UserModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, SqlExecutionerService],
})
export class WorkspaceModule {}
