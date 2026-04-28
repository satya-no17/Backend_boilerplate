import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router()

router.post('/create',(req,res)=>{
    console.log(req.body)
   const token = req.cookies?.token
    

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)
    console.log("done")
    res.json({mes:'done'})
})

export default router