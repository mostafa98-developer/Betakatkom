import { Model, DataTypes, Sequelize } from "sequelize";
import SequelizeInstance from "./connection";

class CardType extends Model {}

CardType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nameArabic: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      references: {
        model: CardType,
        key: "id",
      },
    },
    nameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(4000),
    },
    priceA: {
      type: DataTypes.DOUBLE,
    },
    priceB: {
      type: DataTypes.DOUBLE,
    },
    priceC: {
      type: DataTypes.DOUBLE,
    },
    profitA: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    profitB: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    profitC: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("now"),
    },
    deletedOn: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "CardType",
  }
);

export default CardType;
