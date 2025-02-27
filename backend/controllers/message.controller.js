import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async(req,res)=> {
    try{
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants :{$all :[senderId,receiverId]},
        })

        if(!conversation) {
            conversation = await Conversation.create({
                participants :[senderId,receiverId],
            })
        }
        const newMessage = new Message ({
            senderId,
            receiverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(),newMessage.save()])
        /// sociket oi functionality
        
        const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}
        ///await conversation.save();
        ///await newMessage.save();

      
        res.status(201).json({message:"message sent Succesfully"})
        
    }catch(error){
        console.log("Error in sendMessage controller ", error.message)
        res.status(500).json({error:"Internal server error"})
    }
}
export const getMessage = async(req,res) =>{
    try{

        const {id:userTochatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants:{ $all :[senderId,userTochatId]},
        }).populate("messages");

        
		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

        res.status(200).json(messages);

    }catch(error){
        console.log("Error in sendMessage controller ", error.message)
        res.status(500).json({error:"Internal server error"})
    }
}
