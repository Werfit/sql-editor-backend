import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { SignUpRequestDTO } from "./dto/sign-up.dto";
import { UserService } from "src/user/user.service";
import { LoginRequestDTO } from "./dto/login.dto";
import { UserPayload } from "src/user/user.types";
import { AccessTokenService } from "src/access-token/access-token.service";
import { AuthGuard } from "./authentication.guard";
import { User } from "src/shared/decorators/user.decorator";
import { Request } from "express";
import { RefreshTokenRequestDTO } from "./dto/refresh.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService
  ) {}

  @Post("/login")
  async login(@Body() loginDTO: LoginRequestDTO) {
    const user = await this.userService.verifyCredentials(loginDTO);

    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    return this.getTokenFromUser(user);
  }

  @Post("/sign-up")
  async signUp(@Body() signUpDTO: SignUpRequestDTO) {
    const userExists = await this.userService.exists({
      email: signUpDTO.email,
    });

    if (userExists) {
      throw new NotFoundException("User already exists");
    }

    const user = await this.userService.create(signUpDTO, {
      hidePassword: true,
    });

    return this.getTokenFromUser(user);
  }

  @Post("/refresh")
  async refresh(@Body() refreshTokenRequestDTO: RefreshTokenRequestDTO) {
    const user = await this.userService.findOneBy({
      session: refreshTokenRequestDTO.refreshToken,
    });

    if (!user) {
      throw new ForbiddenException("Invalid refresh token");
    }

    const payload = this.accessTokenService.verifyRefreshToken(
      refreshTokenRequestDTO.refreshToken
    );

    if (!payload) {
      await this.userService.updateSession(user.id, null);
      throw new ForbiddenException("Invalid refresh token");
    }

    const accessToken = this.accessTokenService.getAccessToken({
      id: payload.id,
      email: payload.email,
    });

    return {
      accessToken,
      refreshToken: refreshTokenRequestDTO.refreshToken,
    };
  }

  @Get("/verify")
  @UseGuards(AuthGuard)
  async verify(@User() user: Request["user"]) {
    return { user };
  }

  @Post("/logout")
  @UseGuards(AuthGuard)
  async logout(@User() user: Request["user"]) {
    await this.userService.updateSession(user!.id, null);
  }
  private async getTokenFromUser(user: UserPayload) {
    const refreshToken = this.accessTokenService.getRefreshToken(user);
    await this.userService.updateSession(user.id, refreshToken);

    return {
      accessToken: this.accessTokenService.getAccessToken(user),
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
