import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js"
import connectMongoDB from "./db/connectMongoDB.js";
import cors from 'cors';
import {app, server } from "./socket/socket.js";
import path from "path";


const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

app.use(express.static(path.join(__dirname,"/chat-appFrontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"/chat-appFrontend/dist/index.html"))
});

server.listen(PORT, ()=>{
    connectMongoDB();
    console.log(`Server is running on port ${PORT}`)
})