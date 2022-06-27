import { Router } from "express";
import { generic } from "../utils";
import userController from "../controllers/userController";
import UserType from "../models/userType";
import { HTTP_RESPONSES } from "../utils/constants";

const app = Router({ mergeParams: true });

app.get("/", async (req, res) => {
  const { id } = (req as any).user.toJSON();
  const user = await userController.getById(id, undefined, true);
  res.json(user?.getAsJson());
});

app.put(
  "/change-password",
  generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { user } = req as any;
    userController.changePassword(user.get("id"), oldPassword, newPassword);
    res.json({});
  })
);

app.post(
  "/block",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userIdToBlock } = req.body;
      const userToBlock = await userController.getById(userIdToBlock);
      if (!userToBlock) throw new Error("[RETURN] User Not Found");
      if (
        !(user.get("type") == UserType.adminId && userToBlock.get("type") == UserType.sellerId) &&
        !(user.get("type") == UserType.sellerId && userToBlock.get("type") == UserType.sellingPointId)
      ) {
        res.sendStatus(HTTP_RESPONSES.UNAUTHORIZED);
        return;
      }
      await userController.block(userToBlock.get("id") as string);
      res.json({});
    })
  )
);

app.post(
  "/unblock",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userIdToBlock } = req.body;
      const userToBlock = await userController.getById(userIdToBlock);
      if (!userToBlock) throw new Error("[RETURN] User Not Found");
      if (
        !(user.get("type") == UserType.adminId && userToBlock.get("type") == UserType.sellerId) &&
        !(user.get("type") == UserType.sellerId && userToBlock.get("type") == UserType.sellingPointId)
      ) {
        res.sendStatus(HTTP_RESPONSES.UNAUTHORIZED);
        return;
      }
      await userController.unblock(userToBlock.get("id") as string);
      res.json({});
    })
  )
);

export default generic.encapsulateRouter(app, "/user");
