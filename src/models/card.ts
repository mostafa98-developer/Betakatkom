import { Model, DataTypes, Sequelize } from "sequelize";
import SequelizeInstance from "./connection";
import CardType from "./cardType";
import Transaction from "./transaction";
class Card extends Model {}

Card.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CardType,
        key: "id",
      },
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("now"),
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "Card",
  }
);

Card.hasOne(Transaction, {
  foreignKey: "card",
});
export default Card;
