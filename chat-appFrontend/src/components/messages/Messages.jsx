import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = ({ onSendMessage }) => {
	const { messages, loading, setMessages, addMessage } = useGetMessages();
	const newMessages = useListenMessages();
	const lastMessageRef = useRef(null);

	// Merge new messages if any, and update the messages list
	useEffect(() => {
		if (newMessages && newMessages.length > 0) {
			setMessages((prevMessages) => [...prevMessages, ...newMessages]);
		}
	}, [newMessages, setMessages]);

	// Scroll to the last message when messages change
	useEffect(() => {
		if (messages.length > 0) {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Handler for when a message is sent successfully
	const handleSendMessage = async (messageContent) => {
		try {
			const newMessage = await onSendMessage(messageContent); // This function sends the message to your backend and returns the new message
			addMessage(newMessage); // Add the new message to the list immediately after it's sent
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{!loading && messages.length > 0 &&
				messages.map((message, index) => (
					<div
						key={message._id || `message-${index}`} // Fallback key if _id is missing
						ref={index === messages.length - 1 ? lastMessageRef : null}
					>
						<Message message={message} />
					</div>
				))
			}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}
		</div>
	);
};

export default Messages;
