import { Transaction as DbTransaction, where, col, and, or, literal } from "sequelize";
import Card from "../models/card";
import Transaction from "../models/transaction";
import TranscationType from "../models/transactionType";
import connection from "../models/connection";
import WalletController from "./WalletController";
import UserController from "./userController";
import CardTypeController from "./cardTypeController";
import UserType from "../models/userType";

export default class TransactionController {
  private constructor() {}

  public static async getTransactionsHistory(userId: number): Promise<Transaction[]> {
    return await Transaction.findAll({
      where: or(
        where(col("Transaction.userEffected"), userId as any),
        where(col("Transaction.createdBy"), userId as any)
      ),
      order: literal("Transaction.createdOn ASC"),
    });
  }

  public static async getCard(id: number): Promise<Card | null> {
    return await Card.findOne({
      where: { id },
    });
  }

  public static purchaseCard(userId: number, cardType: number, walletId: number): Promise<Card> {
    return connection.transaction(async (t: DbTransaction) => {
      const _cardType = await CardTypeController.get(cardType, t);
      const user = await UserController.getById(userId, t);
      if (!user) throw new Error("[RETURN] User not found");
      if (!_cardType) throw new Error("[RETURN] Unknown Card Type");
      if (!_cardType.get("priceA") || !_cardType.get("priceB") || !_cardType.get("priceC"))
        throw new Error("[RETURN] Only Leaf Card Types Allowed");
      const sellerForUser = await UserController.getById(user.get("createdBy") as number, t);
      if (!sellerForUser) throw new Error("[RETURN] Seller not found for this selling point");
      const cards = await Card.findAll({
        include: [{ model: Transaction }],
        where: and(where(col("Transaction.card"), "IS", null), where(col("Card.type"), cardType as any)),
        limit: 1,
        transaction: t,
        order: literal("Card.createdOn ASC"),
      });
      if (cards.length === 0) throw new Error("[RETURN] No Cards Found");
      const selectedCard = cards[0];
      const userClass: string = user.get("class") as string;
      if (!userClass) throw new Error("[RETURN] User Doesn't have a defined class");

      await Transaction.create(
        {
          type: TranscationType.cardPurchase,
          amount: -1 * (_cardType.get(`price${userClass}`) as number),
          card: selectedCard.get("id"),
          createdBy: userId,
          userEffected: userId,
        },
        {
          transaction: t,
        }
      );
      try {
        await WalletController.decrementBallance(walletId, _cardType.get(`price${userClass}`) as number, t);
      } catch (e) {
        throw new Error("[RETURN] No Enough Ballance In Wallet!");
      }
      await WalletController.incrementProfit(
        sellerForUser.get("wallet") as number,
        _cardType.get(`profit${userClass}`) as number,
        t
      );
      await Transaction.create(
        {
          type: TranscationType.addProfit,
          amount: +(_cardType.get(`profit${userClass}`) as number),
          createdBy: userId,
          userEffected: sellerForUser.get("id"),
        },
        {
          transaction: t,
        }
      );

      return selectedCard;
    });
  }

  public static increaseBallance(userId: number, userIdToIncrease: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");
      const userToIncreament = await UserController.getById(userIdToIncrease, t);
      const user = await UserController.getById(userId, t);
      if (!userToIncreament || !user) throw new Error("[RETURN] User Not Found");
      if (userToIncreament.get("type") !== UserType.sellingPointId)
        throw new Error("[RETURN] Only Selling Points Users Allowed");
      await Transaction.create(
        {
          type: TranscationType.creditPurchase,
          amount: amount,
          createdBy: userId,
          userEffected: userIdToIncrease,
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.creditSelling,
          amount: amount,
          createdBy: userId,
          userEffected: userId,
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.addDept,
          amount: amount,
          createdBy: userId,
          userEffected: userIdToIncrease,
        },
        {
          transaction: t,
        }
      );

      await WalletController.incrementBallance(userToIncreament.get("wallet") as number, amount, t);
      try {
        await WalletController.decrementBallance(user.get("wallet") as number, amount, t);
      } catch (e) {
        throw new Error("[RETURN] No Enough Ballance In Seller Wallet!");
      }
      await WalletController.incrementDept(userToIncreament.get("wallet") as number, amount, t);
    });
  }

  public static purchaseBill(userId: number, _amount: number): Promise<void> {
    const amount = _amount + Math.ceil(_amount / 100) * 0.25;
    return connection.transaction(async (t: DbTransaction) => {
      const user = await UserController.getById(userId, t);
      if (!user) throw new Error("[RETURN] User not found");
      if (amount <= 0) throw new Error("[RETURN] Bill Price Should Be Larger than 0");
      await Transaction.create(
        {
          type: TranscationType.payBill,
          amount: -1 * amount,
          createdBy: userId,
          userEffected: userId,
        },
        {
          transaction: t,
        }
      );
      try {
        await WalletController.decrementBallance(user.get("wallet") as number, amount, t);
      } catch (e) {
        throw new Error("[RETURN] No Enough Ballance In Wallet!");
      }
    });
  }

  public static grantBallance(userId: number, userIdToIncrease: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");
      const userToIncreament = await UserController.getById(userIdToIncrease, t);
      if (!userToIncreament) throw new Error("[RETURN] User Not Found");
      if (userToIncreament.get("type") !== UserType.sellerId) throw new Error("[RETURN] Only Seller Users Allowed");
      await Transaction.create(
        {
          type: TranscationType.grantBallance,
          amount: amount,
          createdBy: userId,
          userEffected: userIdToIncrease,
        },
        {
          transaction: t,
        }
      );
      await WalletController.incrementBallance(userToIncreament.get("wallet") as number, amount, t);
    });
  }

  public static payDept(userId: number, PayingUserId: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      const userToIncreament = await UserController.getById(PayingUserId, t);
      if (!userToIncreament) throw new Error("[RETURN] User Not Found");
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");
      await Transaction.create(
        {
          type: TranscationType.ballancePay,
          amount: -1 * amount,
          createdBy: userId,
          userEffected: PayingUserId,
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.payDept,
          amount: -1 * amount,
          createdBy: userId,
          userEffected: PayingUserId,
        },
        {
          transaction: t,
        }
      );

      try {
        await WalletController.decrementDept(userToIncreament.get("wallet") as number, amount, t);
      } catch (e: any) {
        if (e.toString().includes("Out of range value")) {
          throw new Error("[RETURN] Given Amount Is Bigger Than Ballance!");
        } else {
          throw new Error(e.toString());
        }
      }
    });
  }

  public static payProfit(userId: number, SellerUserId: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      const sellerUser = await UserController.getById(SellerUserId, t);
      if (!sellerUser) throw new Error("[RETURN] User Not Found");
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");
      await Transaction.create(
        {
          type: TranscationType.payProfit,
          amount: -1 * amount,
          createdBy: userId,
          userEffected: SellerUserId,
        },
        {
          transaction: t,
        }
      );
      try {
        await WalletController.decrementProfit(sellerUser.get("wallet") as number, amount, t);
      } catch (e: any) {
        if (e.toString().includes("Out of range value")) {
          throw new Error("[RETURN] Given Amount Is Bigger Than Profit!");
        } else {
          throw new Error(e.toString());
        }
      }
    });
  }

  public static transferProfit(sellerId: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      const sellerUser = await UserController.getById(sellerId, t);
      if (!sellerUser) throw new Error("[RETURN] User Not Found");
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");

      await Transaction.create(
        {
          type: TranscationType.payProfit,
          amount: -1 * amount,
          createdBy: sellerId,
          userEffected: sellerId,
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.grantBallance,
          amount: amount,
          createdBy: sellerUser,
          userEffected: sellerUser,
        },
        {
          transaction: t,
        }
      );
      try {
        await WalletController.decrementProfit(sellerUser.get("wallet") as number, amount, t);
      } catch (e: any) {
        if (e.toString().includes("Out of range value")) {
          throw new Error("[RETURN] Given Amount Is Bigger Than Profit!");
        } else {
          throw new Error(e.toString());
        }
      }
      await WalletController.incrementBallance(sellerUser.get("wallet") as number, amount, t);
    });
  }
  public static transferDept(payingUserId: number, RecievingUserId: number, amount: number): Promise<void> {
    return connection.transaction(async (t: DbTransaction) => {
      const payingUser = await UserController.getById(payingUserId, t);
      const RecievingUser = await UserController.getById(RecievingUserId, t);
      if (!payingUser || !RecievingUser) throw new Error("[RETURN] User Not Found");
      if (payingUser.get("type") != UserType.sellingPointId)
        throw new Error("[RETURN] Dept Can Only Be Transered From Selling Point To Seller");
      if (amount < 0) throw new Error("[RETURN] Negative Amount Not Allowed");
      await Transaction.create(
        {
          type: TranscationType.ballancePay,
          amount: -1 * amount,
          createdBy: RecievingUser.get("id"),
          userEffected: payingUser.get("id"),
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.payDept,
          amount: amount,
          createdBy: RecievingUser.get("id"),
          userEffected: payingUser.get("id"),
        },
        {
          transaction: t,
        }
      );
      await Transaction.create(
        {
          type: TranscationType.addDept,
          amount: amount,
          createdBy: RecievingUser.get("id"),
          userEffected: RecievingUser.get("id"),
        },
        {
          transaction: t,
        }
      );
      try {
        await WalletController.decrementDept(payingUser.get("wallet") as number, amount, t);
        await WalletController.incrementDept(RecievingUser.get("wallet") as number, amount, t);
      } catch (e: any) {
        if (e.toString().includes("Out of range value")) {
          throw new Error("[RETURN] Given Amount Is Bigger Than Ballance!");
        } else {
          throw new Error(e.toString());
        }
      }
    });
  }

  public static stockTake(transactionID: number): Promise<[number, Transaction[]]> {
    return Transaction.update(
      {
        stockTaken: true,
      },
      {
        where: { id: transactionID },
      }
    );
  }
}
