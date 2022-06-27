import { Request, Response, NextFunction } from "express";
import TokensController from "../controllers/tokensController";
import userController from "../controllers/userController";
import { User } from "../models";
import { HTTP_RESPONSES } from "../utils/constants";

export default async function (req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.get("Authorization");
  if (TokensController.verify(authHeader || "")) {
    (req as any)["user"] = new User(TokensController.decode(authHeader || "") as any);
    (req as any)["user"] = await userController.getById((req as any)["user"].get("id"));
    if ((req as any)["user"].get("blocked")) {
      res.status(HTTP_RESPONSES.UNAUTHORIZED).send("User Blocked");
      return;
    }
    next();
  } else {
    res.sendStatus(HTTP_RESPONSES.UNAUTHORIZED);
  }
}
