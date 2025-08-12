import { createResume } from "../controllers/resume";
import { Router } from "express";

const ResumeRouter = Router();
ResumeRouter.post('/create-resume', createResume)

export default ResumeRouter;