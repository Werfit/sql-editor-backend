import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DataSource } from "typeorm";
import { Owner } from "../decorators/owner.decorator";

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownerships = this.reflector.get(Owner, context.getHandler());

    if (!ownerships) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const id = request.params.id as string | undefined;
    const user = request.user;

    if (!id) {
      throw new BadRequestException("No id was provided");
    }

    if (!user) {
      throw new UnauthorizedException("Not authenticated");
    }

    const searchResult = await Promise.all(
      ownerships.map(async (ownership) => {
        const repository = this.dataSource.getRepository(ownership.entity);

        const count = await repository.countBy({
          id,
          [ownership.field]: {
            id: user.id,
          },
        });

        return count === 1;
      })
    );

    if (!searchResult.every((result) => result)) {
      throw new NotFoundException();
    }

    return true;
  }
}
