import { DataTypes } from "sequelize";
import sequelizeDb from "../db/database";
import users from "./Users.model";

const resume = sequelizeDb.define('resumes',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resume_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'resumes',
    timestamps: true
})

resume.belongsTo(users, { foreignKey: 'user_id' });

export default resume