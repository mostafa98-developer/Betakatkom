import { Sequelize } from "sequelize";
import { config } from "../utils";

const databaseName = config.get("DB_NAME");
const databaseUsername = config.get("DB_USER");
const databasePassword = config.get("DB_PASS");
const databaseHost = config.get("DB_HOST");
const sequelize = new Sequelize(databaseName, databaseUsername, databasePassword, {
  host: databaseHost,
  dialect: "mysql",
  logging: false,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
  },
});

export default sequelize;
