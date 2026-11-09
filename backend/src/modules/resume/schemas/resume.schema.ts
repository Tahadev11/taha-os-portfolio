import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({
  timestamps: true,
  collection: 'resumes',
})
export class Resume {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true, trim: true })
  fileUrl: string;

  @Prop({ type: String, default: '', trim: true })
  fileName: string;

  @Prop({ type: Number, default: 0 })
  fileSize: number;

  @Prop({ type: String, default: '', trim: true })
  description: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);