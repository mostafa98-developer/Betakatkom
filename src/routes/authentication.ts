import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers";
import { HTTP_RESPONSES } from "../utils/constants";
import { tokensController } from "../controllers";
import { generic } from "../utils";

const app = Router();

app.post(
  "/login",
  generic.asyncRouteErrorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const userObj = await userController.get(username);
    if (!userObj || !userObj.verifyPass(password)) {
      res.sendStatus(HTTP_RESPONSES.BAD_REQUEST);
      return;
    }
    const token = tokensController.generate(userObj.getAsJson());
    res.json({
      token,
    });
  })
);

export default app;
