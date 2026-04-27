import jwt from "jsonwebtoken";
import { login,register } from "../services/auth.services.js";




export async function registerUser (req,res) {
    try {
        const {name,email,password} = req.body
        const user = await register(name,email,password)
        res.status(201).json({message: 'user registered',user})

    } catch (error) {
        res.status(400).json({message:error.message})
    }


}

export async function loginUser(req,res) {
    try {
        const {email,password} = req.body
    const data = await login(email,password)
    res.status(200).json({message:'login success',...data})
    
    } catch (error) {
        res.status(400).json({message:error.message})
    }
    
}

