import Card from "../models/card";

export default class WalletController {
  private constructor() {}
  public static async create(code: string, type: number, serialNumber: string): Promise<Card> {
    return await Card.create({ code, type, serialNumber });
  }
}
