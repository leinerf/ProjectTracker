import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../db.js";
import { isNotEmptyString } from "../validators/index.js";
const User = sequelize.define(
    'User', {
        // Model attributes are defined here
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNotEmptyString
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isNotEmptyString
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNotEmptyString
            }
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