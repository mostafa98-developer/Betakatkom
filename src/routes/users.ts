import { Router } from "express";
import { generic } from "../utils";
import { userController } from "../controllers";
import { UserType } from "../models";
import { HTTP_RESPONSES } from "../utils/constants";
const app = Router({ mergeParams: true });

app.get(
  "/sellers",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const sellers = await userController.getSellers();
      res.json(sellers.map((seller) => seller.getAsJson()));
    })
  )
);

app.put(
  "/seller",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const seller = req.body;
      await userController.update(seller);
      res.json({});
    })
  )
);

app.post(
  "/seller",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const seller = req.body;
      const { user } = req as any;
      seller.createdBy = user.id;
      const createdUser = await userController.create(seller, UserType.sellerId);
      res.json(createdUser.getAsJson());
    })
  )
);

app.delete(
  "/seller",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { id } = req.query;
      if (!id) {
        res.sendStatus(HTTP_RESPONSES.BAD_REQUEST);
        return;
      }
      await userController.delete(id as string);
      res.json({});
    })
  )
);

app.get(
  "/selling-points",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const sellingPoints = await userController.getSellingPoints(user.id);
      res.json(sellingPoints.map((sellingPoint) => sellingPoint.getAsJson()));
    })
  )
);

app.get(
  "/selling-points/all",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const sellingPoints = await userController.getSellingPoints();
      res.json(sellingPoints.map((sellingPoint) => sellingPoint.getAsJson()));
    })
  )
);

app.put(
  "/selling-point",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const sellingPoint = req.body;
      await userController.update(sellingPoint);
      res.json({});
    })
  )
);

app.post(
  "/selling-point",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const sellingPoint = req.body;
      sellingPoint.createdBy = user.id;
      const createduser = await userController.create(sellingPoint, UserType.sellingPointId);
      res.json(createduser.getAsJson());
    })
  )
);

app.delete(
  "/selling-point",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { id } = req.query;
      if (!id) {
        res.sendStatus(HTTP_RESPONSES.BAD_REQUEST);
        return;
      }
      await userController.delete(id as string);
      res.json({});
    })
  )
);

export default generic.encapsulateRouter(app, "/users");
