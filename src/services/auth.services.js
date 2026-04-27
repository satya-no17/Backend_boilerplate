import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { findUserByMail,insertUser } from '../queries/auth.queries.js'

export const register = async (name,email,password)=>{
    const existing = await findUserByMail(email)
    if(existing){throw new Error('email already exist')}

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await insertUser(name,email,hashedPassword)
    return user 
}

export const login = async (email, password )=>{
    const user = await findUserByMail(email)
    if(!user){throw new Error('user not exist')}

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) throw new Error('invalid email,password')

    const token = jwt.sign({
        id: user.id ,email:user.email },
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )

    return {user:{id:user.id,name:user.name,email:user.email},token}
}