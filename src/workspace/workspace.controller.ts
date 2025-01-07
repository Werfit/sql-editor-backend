import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/authentication/authentication.guard";
import { CreateWorkspaceDTO } from "./dto/create-workspace.dto";
import { WorkspaceService } from "./workspace.service";
import { User } from "src/shared/decorators/user.decorator";
import type { Request } from "express";
import { SqlExecutionerService } from "src/sql-executioner/sql-executioner.service";
import { RunCodeDTO } from "./dto/run-code.dto";
import { OwnershipGuard } from "src/shared/guards/ownership.guard";
import { Owner } from "src/shared/decorators/owner.decorator";
import { Workspace } from "./workspace.entity";

@Controller("workspace")
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly sqlExecutionerService: SqlExecutionerService
  ) {}

  @Get("/")
  @UseGuards(AuthGuard)
  async list(@User() user: Request["user"]) {
    return this.workspaceService.list(user!.id);
  }

  @Get("/:id")
  @Owner([
    {
      entity: Workspace,
      field: "creator",
    },
  ])
  @UseGuards(AuthGuard, OwnershipGuard)
  async get(@Param("id") id: string) {
    const workspace = await this.workspaceService.get(id);

    if (!workspace) {
      throw new NotFoundException("Workspace is not found");
    }

    return workspace;
  }

  @Post("/")
  @UseGuards(AuthGuard)
  async create(
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @User() user: Request["user"]
  ) {
    // TODO: Handle transactions here
    const workspace = await this.workspaceService.create(
      createWorkspaceDTO,
      user!.id
    );

    await this.sqlExecutionerService.createWorkspace(workspace.id);

    return workspace;
  }

  @Delete("/:id")
  @Owner([
    {
      entity: Workspace,
      field: "creator",
    },
  ])
  @UseGuards(AuthGuard, OwnershipGuard)
  async remove(@Param("id") id: string, @User() user: Request["user"]) {
    if (!this.workspaceService.isOwnedBy(id, user!.id)) {
      throw new NotFoundException("Workspace is not found");
    }

    await this.workspaceService.remove(id, user!.id);
    await this.sqlExecutionerService.deleteWorkspace(id);
    return {
      success: true,
    };
  }

  @Post("/run")
  async run(@Body() runCodeDTO: RunCodeDTO) {
    const workspace = await this.workspaceService.get(runCodeDTO.workspaceId);

    if (!workspace) {
      throw new NotFoundException("Workspace is not found");
    }

    const result = await this.sqlExecutionerService.executeQuery(
      workspace.id,
      runCodeDTO.code
    );

    return {
      result,
      timestamp: new Date().toISOString(),
    };
  }
}
