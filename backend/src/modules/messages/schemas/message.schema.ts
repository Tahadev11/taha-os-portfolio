import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

export interface MessageReply {
  body: string;
  sentAt: Date;
  from: string;
  to: string;
}

@Schema({
  timestamps: true,
  collection: 'messages',
})
export class Message {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, default: '', trim: true })
  subject: string;

  @Prop({ type: String, required: true, trim: true })
  message: string;

  @Prop({
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread',
  })
  status: string;

  @Prop({
    type: [
      {
        body: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    default: [],
  })
  replies: MessageReply[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);