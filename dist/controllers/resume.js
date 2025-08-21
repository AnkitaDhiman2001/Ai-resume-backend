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
exports.deleteResume = exports.editResume = exports.fetchResume = exports.fetchAllResume = exports.completeResume = exports.createResume = void 0;
const templateConfigs_1 = require("../config/templateConfigs");
const Resume_model_1 = __importDefault(require("../models/Resume.model"));
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { personalInfo, education, experience, skills, templateId } = req.body;
        const templateStyle = templateConfigs_1.templates[templateId] || "Default professional format";
        const prompt = `
        Generate a professional, detailed resume in the "${templateId}" template style:
        ${templateStyle}

        Input data:
        - Personal Information: ${JSON.stringify(personalInfo)}
        - Education: ${JSON.stringify(education)}
        - Work Experience: ${JSON.stringify(experience)}
        - Skills: ${JSON.stringify(skills)}

        Requirements:
        - Return only valid JSON with the following sections: summary, personalInfo, education, experience, skills.
        - **Summary**: Generate a concise, professional summary (3-5 sentences) that highlights the candidate's key strengths, career goals, and relevance to their field, inferred from the provided data. Do not simply restate the input data; use AI to craft a narrative that ties together their experience, skills, and aspirations.
        - **Personal Information**: Format the provided personalInfo consistently, ensuring proper capitalization and inclusion of only relevant details (e.g., name, email, phone, LinkedIn, or location, if provided).
        - **Education**: Enhance the education section by standardizing institution names, formatting dates as "MM/YYYY", and adding brief context (e.g., relevant coursework or honors) if applicable and supported by the input.
        - **Work Experience**: Rewrite job descriptions using action-oriented, professional language. Highlight achievements and impact (e.g., "Increased sales by 20%" instead of "Responsible for sales"). Format dates as "MM/YYYY" and ensure job titles and company names are clear and consistent.
        - **Skills**: Categorize skills into relevant groups (e.g., Technical Skills, Soft Skills) if not already categorized. Remove duplicates and prioritize skills based on relevance to the candidate’s field, inferred from experience and education.
        - Ensure consistent tone, professional language, and alignment with industry standards for the candidate’s field.
        - Exclude markdown, code blocks, or any non-JSON text.
        - Do not invent or assume data beyond what is provided; use only the input data but enhance its presentation and wording intelligently.
        `;
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });
        let result = (_b = (_a = completion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : "{}";
        result = result.replace(/```json|```/g, "").trim();
        const resume = JSON.parse(result);
        res.status(200).json({ data: resume, message: "Resume generated successfully" });
    }
    catch (err) {
        console.error("Resume generation error:", err.message);
        res.status(500).json({ error: "Failed to generate resume" });
    }
});
exports.createResume = createResume;
const completeResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, resumeTitle, personalInfo, education, experience, skills, templateId } = req.body;
        const templateStyle = templateConfigs_1.templates[templateId] || "Default professional format";
        const saveToDb = yield Resume_model_1.default.create({
            user_id: userId,
            resume_title: resumeTitle,
            template_type: templateId,
            content: {
                personalInfo,
                education,
                experience,
                skills,
                templateStyle,
            },
        });
        if (saveToDb) {
            res.status(201).json({ data: saveToDb, message: "Resume completed and saved successfully" });
            console.log("Resume completed and saved successfully");
        }
    }
    catch (err) {
        console.error("Resume completion error:", err.message);
        res.status(500).json({ error: "Failed to complete resume" });
    }
});
exports.completeResume = completeResume;
const editResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, resumeId, updatedContent, templateId } = req.body;
        const updatedData = {
            updatedContent,
            templateId
        };
        const updatedResume = yield Resume_model_1.default.update(updatedData, {
            where: { user_id: userId, id: resumeId },
        });
        if (updatedResume) {
            res.status(200).json({ data: updatedResume, message: "Resume updated successfully" });
        }
    }
    catch (err) {
        console.error("Resume update error:", err.message);
        res.status(500).json({ error: "Failed to update resume" });
    }
});
exports.editResume = editResume;
const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, resumeId } = req.body;
        const deletedResume = yield Resume_model_1.default.destroy({
            where: { user_id: userId, id: resumeId },
        });
        if (deletedResume) {
            res.status(200).json({ message: "Resume deleted successfully" });
        }
    }
    catch (err) {
        console.error("Resume deletion error:", err.message);
        res.status(500).json({ error: "Failed to delete resume" });
    }
});
exports.deleteResume = deleteResume;
const fetchAllResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const userResumes = yield Resume_model_1.default.findAll({ where: { user_id: userId } });
        res.status(200).json({ data: userResumes, message: "Resumes fetched successfully" });
    }
    catch (err) {
        console.error("Fetch resume error:", err.message);
        res.status(500).json({ error: "Failed to fetch resumes" });
    }
});
exports.fetchAllResume = fetchAllResume;
const fetchResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, resumeId } = req.params;
        const resumeData = yield Resume_model_1.default.findOne({ where: { user_id: userId, id: resumeId } });
        if (resumeData) {
            res.status(200).json({ data: resumeData, message: "Resume fetched successfully" });
        }
        else {
            res.status(404).json({ error: "Resume not found" });
        }
    }
    catch (err) {
        console.error("Fetch resume error:", err.message);
        res.status(500).json({ error: "Failed to fetch resume" });
    }
});
exports.fetchResume = fetchResume;
//# sourceMappingURL=resume.js.map