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
exports.createResume = void 0;
const Resume_model_1 = __importDefault(require("../models/Resume.model"));
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, resume_title, content } = req.body;
        const newResume = yield Resume_model_1.default.create({
            user_id,
            resume_title,
            content
        });
        if (!newResume) {
            return res.status(400).json({ error: "Resume creation failed" });
        }
        res.status(201).json({ message: "Resume created successfully", data: newResume });
    }
    catch (error) {
        console.error("Error creating resume:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createResume = createResume;
//# sourceMappingURL=resume.js.map