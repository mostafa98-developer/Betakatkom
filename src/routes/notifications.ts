import { Router } from "express";
import { generic } from "../utils";
import notificationController from "../controllers/notificationController";
import userController from "../controllers/userController";
const app = Router({ mergeParams: true });

app.get(
  "/",
  generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
    const { user } = req as any;
    const notifcations = await notificationController.get(parseInt(user.get("id")));
    res.json((notifcations || []).map((item) => item.toJSON()));
  })
);

app.put(
  "/token",
  generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
    const { token } = req.body;
    const { user } = req as any;
    await userController.update({
      id: parseInt(user.get("id")),
      token,
    });
    res.json({});
  })
);

export default generic.encapsulateRouter(app, "/notifications");
