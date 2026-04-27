import cors from "cors"
import dotenv from "dotenv"
import app from "./src/app.js"
import { pool, connectDB } from "./src/db/db.js"

dotenv.config()

connectDB()
app.use(cors())



const PORT = process.env.PORT

app.get('/',(req,res)=>{
    res.json({message: `app is running in ${PORT}`})
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});