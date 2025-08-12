"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resume_1 = require("../controllers/resume");
const express_1 = require("express");
const ResumeRouter = (0, express_1.Router)();
ResumeRouter.post('/create-resume', resume_1.createResume);
exports.default = ResumeRouter;
//# sourceMappingURL=resume.js.map