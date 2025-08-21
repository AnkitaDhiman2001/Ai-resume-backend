import { createResume,completeResume, fetchAllResume, fetchResume, editResume, deleteResume } from "../controllers/resume";
import { Router } from "express";

const ResumeRouter = Router();
ResumeRouter.post('/generate', createResume)
ResumeRouter.post('/complete', completeResume)
ResumeRouter.get('/list/:userId', fetchAllResume)
ResumeRouter.get('/fetch/:userId/:resumeId', fetchResume)
ResumeRouter.put('/edit', editResume)
ResumeRouter.delete('/delete', deleteResume)

export default ResumeRouter;