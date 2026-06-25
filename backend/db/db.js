import { Sequelize } from "sequelize";
import appConfig from "../config.js";

const sequelize = new Sequelize({
    database: appConfig.database,
    username: appConfig.dbUser,
    password: appConfig.dbPassword,
    host: appConfig.dbHost,
    port: appConfig.dbPort,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: appConfig.appEnv !== 'dev' ? true : false,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
});
export default sequelize;