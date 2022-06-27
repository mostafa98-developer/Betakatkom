import CardType from "./../models/cardType";
import { Transaction as DbTransaction } from "sequelize";

export default class CardTypeController {
  private constructor() {}

  public static async create(card: any): Promise<CardType> {
    return await CardType.create(card);
  }
  public static async get(id: number, t?: DbTransaction): Promise<CardType | null> {
    return await CardType.findOne({ where: { id: id }, transaction: t });
  }
  public static async getAll(tree: boolean = true): Promise<any[]> {
    let cards: any[] = await CardType.findAll({
      where: { deletedOn: null },
    });
    cards = cards.map((card) => card.toJSON());
    if (tree) {
      cards.forEach((card: any) => {
        if (card.type) {
          const parentType = cards.find((innerCard) => innerCard.id === card.type);
          if (!parentType) return;
          if (!parentType.children) parentType.children = [];
          parentType.children.push(card);
        }
      });
      cards = cards.filter((card) => !card.type);
    }
    return cards;
  }
  public static async update(card: any): Promise<void> {
    await CardType.update(card, { where: { id: card.id } });
  }

  public static async delete(card: { id: number }): Promise<void> {
    await CardType.update({ deletedOn: Date.now() }, { where: { id: card.id } });
  }
}
