import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
    'User', {
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,

        }
    },
);

//Only run if table doesn't exist 
// await User.sync();
//Only run if table needs to be updated
// await User.sync({alter: true});
export default User;