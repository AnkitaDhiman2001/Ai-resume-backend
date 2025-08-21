import { templates } from "../config/templateConfigs";
import resume from "../models/Resume.model";
import { Request, Response } from "express";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createResume = async (req: Request, res: Response) => {
 try {
    const { personalInfo, education, experience, skills, templateId } = req.body;

    const templateStyle = templates[templateId] || "Default professional format";

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, 
    });

    let result = completion.choices[0].message?.content ?? "{}";

    result = result.replace(/```json|```/g, "").trim();
    const resume = JSON.parse(result);
    res.status(200).json({data: resume,  message: "Resume generated successfully" });
  } catch (err: any) {
    console.error("Resume generation error:", err.message);
    res.status(500).json({ error: "Failed to generate resume" });
  }
};

const completeResume = async (req: Request, res: Response) => {
 try {
    const {userId, resumeTitle, personalInfo, education, experience, skills, templateId } = req.body;
    const templateStyle = templates[templateId] || "Default professional format";

    const saveToDb = await resume.create({
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
    if (saveToDb){
      res.status(201).json({data: saveToDb, message: "Resume completed and saved successfully"});
      console.log("Resume completed and saved successfully");
    }
  } catch (err: any) {
    console.error("Resume completion error:", err.message);
    res.status(500).json({ error: "Failed to complete resume" });
  }
}

const editResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeId, updatedContent, templateId } = req.body;
    const updatedData = {
      updatedContent,
      templateId
    }
    const updatedResume = await resume.update(updatedData, {
      where: { user_id: userId, id: resumeId },
    });
    if (updatedResume) {
      res.status(200).json({ data: updatedResume, message: "Resume updated successfully" });
    }
  } catch (err: any) {
    console.error("Resume update error:", err.message);
    res.status(500).json({ error: "Failed to update resume" });
  }
};

const deleteResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeId } = req.body;
    const deletedResume = await resume.destroy({
      where: { user_id: userId, id: resumeId },
    });
    if (deletedResume) {
      res.status(200).json({ message: "Resume deleted successfully" });
    }
  } catch (err: any) {
    console.error("Resume deletion error:", err.message);
    res.status(500).json({ error: "Failed to delete resume" });
  }
};

const fetchAllResume = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userResumes = await resume.findAll({ where: { user_id: userId } });
    res.status(200).json({ data: userResumes, message: "Resumes fetched successfully" });
  } catch (err: any) {
    console.error("Fetch resume error:", err.message);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
};

const fetchResume = async (req: Request, res: Response) => {
  try {
    const { userId, resumeId } = req.params;
    const resumeData = await resume.findOne({ where: { user_id: userId, id: resumeId } });
    if (resumeData) {
      res.status(200).json({ data: resumeData, message: "Resume fetched successfully" });
    } else {
      res.status(404).json({ error: "Resume not found" });
    }
  } catch (err: any) {
    console.error("Fetch resume error:", err.message);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
};

export {
    createResume,
    completeResume,
    fetchAllResume,
    fetchResume,
    editResume,
    deleteResume
};