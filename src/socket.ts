import { Server, Socket } from "socket.io";
import ChatRoom from "./models/chat-room-model";
import Chat from "./models/message-model";

// Function to set up Socket.IO
export function setupSocketIO(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle join chat room
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle send message
    socket.on("sendMessage", async (roomId: string, senderId: string, message: string) => {
      try {
        const chat = new Chat({ chatRoom: roomId, sender: senderId, message });
        await chat.save();

        await ChatRoom.findByIdAndUpdate(roomId, {
          $push: { messages: chat._id },
          lastMessage: chat._id,
          updatedAt: Date.now(),
        }).exec();

        // Emit the new message to the chat room
        io.to(roomId).emit("message", chat);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
