import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
export const signup = async(req,res) =>{
   try{
    const {fullName,userName,password,confirmPassword,gender} = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({error:"Passwords do not match"})
    }
    const existingUser = await User.findOne({userName});
    if(existingUser){
        return res.status(400).json({error:"userName already exists"})
    }
    
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`

    ///hashed password
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
     // Should be 'string'
    const newUser = new User({
        fullName,
        userName,
        password:hashedPassword,
        gender,
        profilePic:gender === "male" ? boyProfilePic : girlProfilePic
    })
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);

        await newUser.save();
     res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        userName:newUser.userName,
        profilePic:newUser.profilePic

     })
    }
    
   }catch(error){
    console.log("error in signup controller  ",error)
    res.status(500).json({ error:"Internal Server Error!!"})
   }
}
export const login = async(req,res) =>{
    try{
        const {userName,password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invaild userName or password"});
        }
        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            profilePic:user.profilePic
        })
    }catch(error){
        res.status(500).json({
        error:"Error in Internal server "
        })
        console.log("error in login controller  ",error)
    }
}

export const logout = (req,res) =>{
    try{
        res.cookie("jwt"," ",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("logoutuser");
        res.status(500).json({error:"Error in Internal server "})
    
    }

}
