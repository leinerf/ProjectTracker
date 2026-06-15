import { Sequelize, DataTypes, Deferrable } from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";
import Project from "./Project.js";
import { isNotEmptyString } from "../validators/index.js";

const Task = sequelize.define(
    'Task', {
        // Model attributes are defined here
        detail: {
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
        project_id: {
            type: Sequelize.UUID,
            references: {
                // This is a reference to another model
                model: Project,
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
        start: {
            // date that you created and worked on tasks
            type: DataTypes.DATE,
            allowNull: false
        },
        finish: {
            type: DataTypes.DATE,
        },
        milliseconds: {
            // time spent on task in seconds
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }
)


//Only run if table doesn't exist 
//await Task.sync();
//Only run if table needs to be updated
// await Task.sync({ alter: true });
export default Task