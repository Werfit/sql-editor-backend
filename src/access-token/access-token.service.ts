import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  email: string;
};

@Injectable()
export class AccessTokenService {
  private accessSecret: string;
  private refreshSecret: string;
  private accessTTL: number;
  private refreshTTL: number;

  constructor(data: {
    accessSecret: string;
    refreshSecret: string;
    accessTTL: number;
    refreshTTL: number;
  }) {
    this.accessSecret = data.accessSecret;
    this.refreshSecret = data.refreshSecret;
    this.accessTTL = data.accessTTL;
    this.refreshTTL = data.refreshTTL;
  }

  getAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.accessTTL,
    });
  }

  getRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.refreshTTL,
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
