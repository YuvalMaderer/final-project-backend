import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interfaces for the document and model
export interface IChatRoom extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema with TypeScript types
const chatRoomSchema = new Schema<IChatRoom>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Chat', required: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Chat' },  // To quickly retrieve the last message
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the model
const ChatRoom: Model<IChatRoom> = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
export default ChatRoom;
