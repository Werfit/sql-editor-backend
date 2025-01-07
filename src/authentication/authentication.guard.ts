import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { AccessTokenService } from "src/access-token/access-token.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private accessTokenService: AccessTokenService,
    private userService: UserService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  private async validateRequest(request: Request): Promise<boolean> {
    const authorization = request.headers["authorization"];

    if (!authorization) {
      throw new UnauthorizedException("Not authenticated");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = this.accessTokenService.verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException("Not authenticated");
    }

    const user = await this.userService.findOneBy({
      id: payload.id,
    });

    if (!user) {
      throw new UnauthorizedException("Not authenticated");
    }

    request.user = {
      id: user.id,
      email: user.email,
    };

    return true;
  }
}
