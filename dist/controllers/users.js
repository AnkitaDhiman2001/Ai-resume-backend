"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUsers = void 0;
const Users_model_1 = __importDefault(require("../models/Users.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        if (hashedPassword) {
            const newUsers = yield Users_model_1.default.create({
                name: req.body.name,
                email: req.body.email,
                password_hash: hashedPassword
            });
            if (newUsers) {
                res.status(201).json({ data: newUsers });
            }
            else {
                res.status(400).json({ error: "User creation failed" });
            }
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createUsers = createUsers;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email) {
            const user = yield Users_model_1.default.findOne({
                where: {
                    email: email
                }
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const hashedPassword = yield bcrypt_1.default.compare(password, user.password_hash);
            if (!hashedPassword) {
                return res.status(401).json({ error: "Password is incorrect" });
            }
            if (user && hashedPassword) {
                res.status(200).json({ data: user, message: "Login successful" });
            }
            else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        }
        else {
            res.status(400).json({ error: "Email and password are required" });
        }
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
//# sourceMappingURL=users.js.map