import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Notification document
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Create the Notification schema
const notificationSchema: Schema<INotification> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Create the Notification model
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
