import { User } from "src/user/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: User["id"];
        email: User["email"];
      };
    }
  }
}
