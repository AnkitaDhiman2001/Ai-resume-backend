"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resume_1 = require("../controllers/resume");
const express_1 = require("express");
const ResumeRouter = (0, express_1.Router)();
ResumeRouter.post('/generate', resume_1.createResume);
ResumeRouter.post('/complete', resume_1.completeResume);
ResumeRouter.get('/list/:userId', resume_1.fetchAllResume);
ResumeRouter.get('/fetch/:userId/:resumeId', resume_1.fetchResume);
ResumeRouter.put('/edit', resume_1.editResume);
ResumeRouter.delete('/delete', resume_1.deleteResume);
exports.default = ResumeRouter;
//# sourceMappingURL=resume.js.map