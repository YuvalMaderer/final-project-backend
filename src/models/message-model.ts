import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Chat document
export interface IChat extends Document {
  chatRoom: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

// Create the Chat schema
const chatSchema: Schema<IChat> = new Schema({
  chatRoom: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Chat model
const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
