import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const pool = new Pool({
    connectionString: process.env.DB_URL,
   })
const connectDB = async () => {
    try {
        await pool.query("select now()")
        console.log('db connected')
    } catch (error) {
        console.error('db connection failed')
    }
}

export {connectDB,pool}