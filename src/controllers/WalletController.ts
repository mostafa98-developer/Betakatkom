import Wallet from "../models/wallet";
import { Transaction } from "sequelize";
export default class WalletController {
  private constructor() {}

  public static async create(intialBalance: number = 0): Promise<Wallet> {
    return await Wallet.create({ balance: intialBalance });
  }

  public static async incrementBallance(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("balance", { by: amount, where: { id }, transaction });
  }

  public static async decrementBallance(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("balance", { by: -1 * amount, where: { id }, transaction });
  }

  public static async incrementDept(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("dept", { by: amount, where: { id }, transaction });
  }

  public static async decrementDept(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("dept", { by: -1 * amount, where: { id }, transaction });
  }

  public static async incrementProfit(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("profit", { by: amount, where: { id }, transaction });
  }

  public static async decrementProfit(id: number, amount: number, transaction?: Transaction): Promise<void> {
    await Wallet.increment("profit", { by: -1 * amount, where: { id }, transaction });
  }
}
