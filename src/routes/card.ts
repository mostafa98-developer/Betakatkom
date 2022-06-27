import { Router } from "express";
import { generic } from "../utils";
import Card from "../controllers/cardController";
import UserType from "../models/userType";
const app = Router({ mergeParams: true });

app.post(
  "/",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { code, type, serialNumber } = req.body;
      const card = await Card.create(code, type, serialNumber);
      res.json(card.toJSON());
    })
  )
);

export default generic.encapsulateRouter(app, "/card");
