import type { User } from "../DB/models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user: InstanceType<typeof User>;
    }
  }
}

export {};