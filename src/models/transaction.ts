import { Model, DataTypes, Sequelize } from "sequelize";
import SequelizeInstance from "./connection";
import TransactionType from "./transactionType";
import User from "./user";

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TransactionType,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    stockTaken: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    card: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    userEffected: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("now"),
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "Transaction",
  }
);

export default Transaction;
