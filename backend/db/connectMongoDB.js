import mongoose from "mongoose";

const connectMongoDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Connected");
    }catch(error){
        console.log("connection error with mongodb  "+error.message);
    }
}

export default connectMongoDB;