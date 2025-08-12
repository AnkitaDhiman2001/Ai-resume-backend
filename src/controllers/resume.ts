import resume from "../models/Resume.model";
import { Request, Response } from "express";

const createResume = async (req: Request, res: Response) => {
    try {
        const { user_id, resume_title, content } = req.body;
        const newResume = await resume.create({
            user_id,
            resume_title,
            content
        });
        if (!newResume) {
            return res.status(400).json({ error: "Resume creation failed" });
        }
        res.status(201).json({ message: "Resume created successfully", data: newResume });
    } catch (error) {
        console.error("Error creating resume:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export {
    createResume
};