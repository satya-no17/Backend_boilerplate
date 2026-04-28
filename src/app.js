import express from "express";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js"
import cookieParser from "cookie-parser";
import { protect } from './middleWares/auth.middleware.js';

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/auth',authRoutes)

app.use('/post',protect,postRoutes)
export default app