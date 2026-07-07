import { Sequelize, DataTypes, Deferrable } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";
import { isNotEmptyString } from "../validators/index.js";

const Project = sequelize.define(
    'Project', {
        // Model attributes are defined here
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNotEmptyString
            }
        },
        description: {
            type: DataTypes.TEXT('medium'),
        },
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.UUID,
            references: {
                // This is a reference to another model
                model: User,
                // This is the column name of the referenced model
                key: 'id',
                // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
                deferrable: Deferrable.INITIALLY_IMMEDIATE,
                // Options:
                // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
                // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
                // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
            },
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        due_date: {
            type: DataTypes.DATE,
        },
        priority: {
            type: DataTypes.INTEGER,
            defaultValue: 9,
            validate: {
                min: 1,
                max: 9
            }
        },
    }
)

//Only run if table doesn't exist 
// await Project.sync();
//Only run if table needs to be updated
//await Project.sync({ alter: true });
export default Project