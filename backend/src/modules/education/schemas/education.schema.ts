import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EducationDocument = HydratedDocument<Education>;

@Schema({
  timestamps: true,
  collection: 'education',
})
export class Education {
  @Prop({ type: String, required: true, trim: true })
  degree: string;

  @Prop({ type: String, required: true, trim: true })
  institution: string;

  @Prop({ type: String, default: '', trim: true })
  fieldOfStudy: string;

  @Prop({ type: String, default: '', trim: true })
  location: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate?: Date;

  @Prop({ type: Boolean, default: false })
  isCurrent: boolean;

  @Prop({ type: String, default: '', trim: true })
  grade: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;
}

export const EducationSchema = SchemaFactory.createForClass(Education);