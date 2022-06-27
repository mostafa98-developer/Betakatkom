import { Model, DataTypes } from "sequelize";
import SequelizeInstance from "./connection";

class TransactionType extends Model {
  static get types(): TransactionType[] {
    return [
      { id: this.creditPurchase, name: "Credit Purchase" },
      { id: this.cardPurchase, name: "Card Purchase" },
      { id: this.creditSelling, name: "Credit Selling" },
      { id: this.ballancePay, name: "Ballance Pay" },
      { id: this.addDept, name: "Add Dept" },
      { id: this.payDept, name: "Pay Dept" },
      { id: this.grantBallance, name: "Grant Ballance" },
      { id: this.addProfit, name: "Add Profit" },
      { id: this.payProfit, name: "Pay Profit" },
      { id: this.payBill, name: "Pay Bill" },
    ].map((type) => new TransactionType(type));
  }

  static get creditPurchase(): number {
    return 1;
  }

  static get cardPurchase(): number {
    return 2;
  }

  static get creditSelling(): number {
    return 3;
  }

  static get ballancePay(): number {
    return 4;
  }

  static get addDept(): number {
    return 5;
  }

  static get payDept(): number {
    return 6;
  }

  static get grantBallance(): number {
    return 7;
  }

  static get addProfit(): number {
    return 8;
  }

  static get payProfit(): number {
    return 9;
  }

  static get payBill(): number {
    return 10;
  }
}

TransactionType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "TransactionType",
  }
);

export default TransactionType;
