import { Model, DataTypes, Sequelize } from "sequelize";
import SequelizeInstance from "./connection";
import UserType from "./userType";
import Wallet from "./wallet";
import { crypto } from "../utils";
class User extends Model {
  getAsJson() {
    const user: any = this.toJSON();
    delete user.password;
    return user;
  }
  verifyPass(password: string): boolean {
    const currentPassword = this.get("password");
    return crypto.hash(password) === currentPassword;
  }

  isAdmin() {
    const adminId = UserType.adminId;
    return this.get("type") == adminId;
  }

  isSeller() {
    const sellerId = UserType.sellerId;
    return this.get("type") == sellerId;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    class: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserType,
        key: "id",
      },
    },
    createdBy: {
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
    deletedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "User",
  }
);

User.belongsTo(Wallet, {
  foreignKey: "wallet",
});
export default User;
