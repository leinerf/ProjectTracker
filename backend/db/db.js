import { Sequelize } from "sequelize";
import appConfig from "../config.js";

const options = {
    ssl: {
        require: true,
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS
    }
}

const sequelize = new Sequelize({
    database: appConfig.database,
    username: appConfig.dbUser,
    password: appConfig.dbPassword,
    host: appConfig.dbHost,
    port: appConfig.dbPort,
    dialect: "postgres",
    dialectOptions: appConfig.appEnv === 'prod' ? options : {},
});

export default sequelize;