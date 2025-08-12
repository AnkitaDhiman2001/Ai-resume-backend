import users from "../models/Users.model";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';

const createUsers = async(req: Request, res: Response)=> {
    const saltRounds = 10;
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        if(hashedPassword){
            const newUsers = await users.create({
                name: req.body.name,
                email: req.body.email,
                password_hash: hashedPassword
            })
            if(newUsers) {
                res.status(201).json({data: newUsers});
            } else {
                res.status(400).json({ error: "User creation failed" });
            }
        }
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const login = async(req: Request, res: Response)=>{
 
    try{
        const {email, password}  = req.body;
        if(email) {
            const user:any = await users.findOne({
                where : {
                    email: email
                }
            })
            if(!user){
                return res.status(404).json({ error: "User not found" });
            }
            const hashedPassword = await bcrypt.compare(password, user.password_hash)
            if(!hashedPassword){
                return res.status(401).json({ error: "Password is incorrect" }); 
            }
            if(user && hashedPassword) {
                res.status(200).json({data: user,  message: "Login successful" });
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        } else {
            res.status(400).json({ error: "Email and password are required" });
        }
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export {
    createUsers,
    login
};