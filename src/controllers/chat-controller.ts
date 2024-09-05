import { Request, Response } from "express";
import ChatRoom, { IChatRoom } from "../models/chat-room-model";
import Chat, { IChat } from "../models/message-model";
import mongoose from "mongoose";
import { io } from "../index";

// Create or find a chat room between two users
async function findOrCreateChatroom(req: Request, res: Response) {
  // Extract user IDs, sender, and message from query parameters
  const userId1 = req.query.userId1 as string;
  const userId2 = req.query.userId2 as string;
  const senderId = req.query.senderId as string;
  const messageText = req.query.message as string;

  if (!userId1 || !userId2 || !senderId || !messageText) {
      return res.status(400).json({ error: 'userId1, userId2, senderId, and message are required' });
  }

  // Create an array of user IDs
  const userIds = [userId1, userId2];

  // Check for existing chatroom with the participants
  let chatRoom: IChatRoom | null = await ChatRoom.findOne({
      participants: { $all: userIds, $size: userIds.length }
  }).exec();

  // If no chatroom is found, create a new one
  if (!chatRoom) {
      chatRoom = new ChatRoom({ participants: userIds });
      await chatRoom.save();

      // Create the new message with explicit type
      const newMessage: IChat = new Chat({
          chatRoom: chatRoom._id,
          sender: senderId,
          message: messageText,
      });

      // Save the message to the database
      await newMessage.save();

      // Update the chatroom with the last message
      chatRoom.lastMessage = newMessage._id as mongoose.Types.ObjectId; // Explicitly cast to ObjectId
      chatRoom.messages.push(newMessage._id as mongoose.Types.ObjectId); // Explicitly cast to ObjectId
      await chatRoom.save();
  }

  res.status(200).json(chatRoom);
}

// Send a message
async function sendMessage(req: Request, res: Response) {
  const { roomId } = req.params;
  const { senderId, message }: { senderId: string, message: string } = req.body;
  
  try {
      const chat: IChat = new Chat({ chatRoom: roomId, sender: senderId, message });
      await chat.save();
      
      await ChatRoom.findByIdAndUpdate(roomId, {
          $push: { messages: chat._id },
          lastMessage: chat._id,
          updatedAt: Date.now(),
      }).exec();
      
      // Emit the new message to the chat room via Socket.IO
      io.to(roomId).emit("message", chat);

      res.status(200).json(chat);
  } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "An error occurred while sending the message" });
  }
}

// Get chat history
async function getChatHistory(req: Request, res: Response) {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
    }

    const chatRoom: IChatRoom | null = await ChatRoom.findById(roomId)
      .populate('messages')
      .populate('participants', 'name email firstName lastName')
      .exec();
  
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
  
    res.status(200).json(chatRoom);
}

// Get all chatroom IDs for a specific user
async function getUserChatRooms(req: Request, res: Response) {
  const userId = req.params.userId as string;

  if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  try {
      // Find all chatrooms where the user is a participant
      const chatRooms = await ChatRoom.find({
          participants: userId
      }).select('_id');

      if (!chatRooms || chatRooms.length === 0) {
          return res.status(404).json({ message: "No chat rooms found for this user" });
      }

      // Map to extract chat room IDs
      const chatRoomIds = chatRooms.map(chatRoom => chatRoom._id);

      res.status(200).json(chatRoomIds);
  } catch (error) {
      console.error("Error retrieving chat rooms:", error);
      res.status(500).json({ error: "An error occurred while retrieving chat rooms" });
  }
}

// Get participants and last message by room ID
async function getParticipantsAndLastMessageByRoomId(req: Request, res: Response) {
  const { roomId } = req.params;

  try {
      // Find the chat room by ID and populate the participants and lastMessage fields
      const chatRoom: IChatRoom | null = await ChatRoom.findById(roomId)
          .populate('participants', 'name email firstName lastName')
          .populate('lastMessage')
          .exec();

      if (!chatRoom) {
          return res.status(404).json({ message: "Chat room not found" });
      }

      // Return participants and last message
      res.status(200).json({
          participants: chatRoom.participants,
          lastMessage: chatRoom.lastMessage,
      });
  } catch (error) {
      console.error("Error retrieving participants and last message:", error);
      res.status(500).json({ error: "An error occurred while retrieving participants and last message" });
  }
}


export {
    findOrCreateChatroom,
    sendMessage,
    getChatHistory,
    getUserChatRooms,
    getParticipantsAndLastMessageByRoomId
}
