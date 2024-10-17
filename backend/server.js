import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/"
import connectMongoDB from "./db/connectMongoDB.js";


const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);


app.listen(PORT, ()=>{
    connectMongoDB();
    console.log(`Server is running on port ${PORT}`)
})