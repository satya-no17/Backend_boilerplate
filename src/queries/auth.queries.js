import { pool } from "../db/db.js";

export const findUserByMail = async(email)=>{
    const result = await pool.query(
        `SELECT * from users where email =$1`,[email]
    )
    return result.rows[0]
}

export const insertUser = async(name ,email,hashedPassword)=>{

    const result = await pool.query(
        `insert into users(name,email,password) values ($1,$2,$3) returning id,name,email`,[name , email,hashedPassword]
    )
    return result.rows[0]

}



