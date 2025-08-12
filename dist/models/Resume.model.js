"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../db/database"));
const Users_model_1 = __importDefault(require("./Users.model"));
const resume = database_1.default.define('resumes', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    resume_title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false
    }
}, {
    tableName: 'resumes',
    timestamps: true
});
resume.belongsTo(Users_model_1.default, { foreignKey: 'user_id' });
exports.default = resume;
//# sourceMappingURL=Resume.model.js.map