import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity";
import { Repository } from "typeorm";
import { CreateWorkspaceDTO } from "./dto/create-workspace.dto";
import type { User } from "src/user/user.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>
  ) {}

  async list(userId: User["id"]) {
    return this.workspaceRepository.find({
      where: {
        creator: {
          id: userId,
        },
      },
      order: {
        createdAt: -1,
      },
    });
  }

  async get(workspaceId: Workspace["id"]) {
    return this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
  }

  async isOwnedBy(workspaceId: Workspace["id"], userId: User["id"]) {
    const workspaces = await this.workspaceRepository.countBy({
      id: workspaceId,
      creator: {
        id: userId,
      },
    });
    return workspaces === 1;
  }

  async create(data: CreateWorkspaceDTO, userId: User["id"]) {
    const workspace = this.workspaceRepository.create({
      name: data.name,
      creator: {
        id: userId,
      },
    });

    return this.workspaceRepository.save(workspace);
  }

  async remove(workspaceId: Workspace["id"], userId: User["id"]) {
    return this.workspaceRepository.delete({
      id: workspaceId,
      creator: {
        id: userId,
      },
    });
  }
}
