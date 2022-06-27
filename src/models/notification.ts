import { Model, DataTypes } from "sequelize";
import SequelizeInstance from "./connection";
import NotificationType from "./notificationType";
import User from "./user";

class Notification extends Model {}

Notification.init(
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
        model: NotificationType,
        key: "id",
      },
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    details: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "Notification",
  }
);

export default Notification;
