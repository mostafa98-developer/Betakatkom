import { Model, DataTypes } from "sequelize";
import SequelizeInstance from "./connection";

class NotificationType extends Model {
  static get types(): NotificationType[] {
    return [
      { id: this.ballanceIncreased, name: "Ballance Increased" },
      { id: this.deptPaid, name: "Dept Paid" },
    ].map((type) => new NotificationType(type));
  }

  static get ballanceIncreased(): number {
    return 1;
  }

  static get deptPaid(): number {
    return 2;
  }
}

NotificationType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: SequelizeInstance,
    modelName: "NotificationType",
  }
);

export default NotificationType;
