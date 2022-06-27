import { HTTP_RESPONSES } from "./../utils/constants";
import { Router } from "express";
import { generic } from "../utils";
import CardTypeController from "../controllers/cardTypeController";
import UserType from "../models/userType";
const app = Router({ mergeParams: true });

app.get(
  "/",
  generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
    const cards = await CardTypeController.getAll();
    res.json(cards);
  })
);

app.post(
  "/",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { nameArabic, nameEnglish, image, priceA, profitA, priceB, profitB, priceC, profitC, type } = req.body;
      const cardType = await CardTypeController.create({
        nameArabic,
        nameEnglish,
        image,
        priceA,
        profitA,
        priceB,
        profitB,
        priceC,
        profitC,
        type,
      });
      res.json(cardType.toJSON());
    })
  )
);

app.put(
  "/",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const card = req.body;
      await CardTypeController.update(card);
      res.json({});
    })
  )
);

app.delete(
  "/",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { id } = req.query;
      if (!id) {
        res.sendStatus(HTTP_RESPONSES.BAD_REQUEST);
        return;
      }
      await CardTypeController.delete({ id } as any);
      res.json({});
    })
  )
);

export default generic.encapsulateRouter(app, "/card-type");
