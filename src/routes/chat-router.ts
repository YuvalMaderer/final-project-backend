import express from "express";
import { findOrCreateChatroom, getChatHistory, getParticipantsAndLastMessageByRoomId, getUserChatRooms, sendMessage } from "../controllers/chat-controller";

const chatRouter = express.Router();

// Create or find a chat room by two users id
chatRouter.post('/chatroom', findOrCreateChatroom);

// Send a message
chatRouter.post('/chatroom/:roomId/message', sendMessage);

// Get chat history
chatRouter.get('/chatroom/:roomId', getChatHistory);

// Get room ids by user Id
chatRouter.get('/chatroom/user/:userId', getUserChatRooms)

chatRouter.get('/chatroom/room/:roomId', getParticipantsAndLastMessageByRoomId)

export default chatRouter