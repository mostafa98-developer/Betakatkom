import { Router } from "express";
import { generic } from "../utils";
import TransactionController from "../controllers/transactionController";
import UserType from "../models/userType";
import NotificationController from "../controllers/notificationController";
import NotificationTypes from "../models/notificationType";

const app = Router({ mergeParams: true });

app.get(
  "/",
  generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
    const { user } = req as any;
    const transactions = await TransactionController.getTransactionsHistory(user.id);
    const finalTransactions = [];
    for (const item of transactions) {
      let tempItem = item.toJSON();
      if ((tempItem as any).card) {
        (tempItem as any).card = (await TransactionController.getCard((tempItem as any).card))?.toJSON();
      }
      finalTransactions.push(tempItem);
    }

    res.json(finalTransactions || []);
  })
);

app.post(
  "/pruchase/card/",
  generic.roleBasedRouteWrapper(
    UserType.sellingPointId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { type } = req.body;
      const card = await TransactionController.purchaseCard(user.id, parseInt(type), user.wallet);
      res.json(card.toJSON());
    })
  )
);

app.post(
  "/pruchase/credit",
  generic.roleBasedRouteWrapper(
    UserType.sellerId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userToIncreament, amount } = req.body;
      await TransactionController.increaseBallance(user.id, parseInt(userToIncreament), parseFloat(amount));
      await NotificationController.create(parseInt(userToIncreament), NotificationTypes.ballanceIncreased);
      res.json({});
    })
  )
);

app.post(
  "/pruchase/bill",
  generic.roleBasedRouteWrapper(
    UserType.sellingPointId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { amount } = req.body;
      await TransactionController.purchaseBill(user.id, parseFloat(amount));
      res.json({});
    })
  )
);

app.post(
  "/grant/credit",
  generic.roleBasedRouteWrapper(
    UserType.adminId,
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userToIncreament, amount } = req.body;
      await TransactionController.grantBallance(user.id, parseInt(userToIncreament), parseFloat(amount));
      await NotificationController.create(parseInt(userToIncreament), NotificationTypes.ballanceIncreased);
      res.json({});
    })
  )
);

app.post(
  "/ballance/pay",
  generic.roleBasedRouteWrapper(
    [UserType.adminId, UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userToIncreament, amount } = req.body;
      if (user.get("type") == UserType.adminId) {
        await TransactionController.payDept(user.id, userToIncreament, parseFloat(amount));
      } else {
        await TransactionController.transferDept(userToIncreament, user.id, parseFloat(amount));
      }
      await NotificationController.create(parseInt(userToIncreament), NotificationTypes.deptPaid);
      res.json({});
    })
  )
);

app.post(
  "/profit/pay",
  generic.roleBasedRouteWrapper(
    [UserType.adminId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { user: userToIncreament, amount } = req.body;
      await TransactionController.payProfit(user.id, userToIncreament, parseFloat(amount));
      res.json({});
    })
  )
);

app.put(
  "/profit/transfer",
  generic.roleBasedRouteWrapper(
    [UserType.sellerId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { user } = req as any;
      const { amount } = req.body;
      await TransactionController.transferProfit(user.id, parseFloat(amount) || 0);
      res.json({});
    })
  )
);

app.post(
  "/stock-take",
  generic.roleBasedRouteWrapper(
    [UserType.sellingPointId],
    generic.asyncRouteErrorHandlerWrapper(async (req, res) => {
      const { transaction } = req.body;
      await TransactionController.stockTake(transaction);
      res.json({});
    })
  )
);

export default generic.encapsulateRouter(app, "/transaction");
