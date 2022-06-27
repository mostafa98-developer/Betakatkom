import { Model, DataTypes } from "sequelize";
import SequelizeInstance from "./connection";

class UserType extends Model {
  static get types(): UserType[] {
    return [
      { id: this.adminId, name: "admin" },
      { id: this.sellerId, name: "seller" },
      { id: this.sellingPointId, name: "sellingPoint" },
    ].map((type) => new UserType(type));
  }

  static get adminId(): number {
    return 1;
  }
  static get sellerId(): number {
    return 2;
  }
  static get sellingPointId(): number {
    return 3;
  }
}

UserType.init(
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
    modelName: "UserType",
  }
);

export default UserType;
