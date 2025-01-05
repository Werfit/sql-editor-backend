import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/authentication/authentication.guard";
import { CreateWorkspaceDTO } from "./dto/create-workspace.dto";
import { WorkspaceService } from "./workspace.service";
import { User } from "src/shared/decorators/user.decorator";
import type { Request } from "express";

@Controller("workspace")
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get("/")
  @UseGuards(AuthGuard)
  async list(@User() user: Request["user"]) {
    return this.workspaceService.list(user!.id);
  }

  @Post("/")
  @UseGuards(AuthGuard)
  async create(
    @Body() createWorkspaceDTO: CreateWorkspaceDTO,
    @User() user: Request["user"]
  ) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return this.workspaceService.create(createWorkspaceDTO, user!.id);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  async remove(@Param("id") id: string, @User() user: Request["user"]) {
    await this.workspaceService.remove(id, user!.id);
    return {
      success: true,
    };
  }
}
