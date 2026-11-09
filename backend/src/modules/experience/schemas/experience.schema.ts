import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExperienceDocument = HydratedDocument<Experience>;

@Schema({
  timestamps: true,
  collection: 'experiences',
})
export class Experience {
  @Prop({ type: String, required: true, trim: true })
  position: string;

  @Prop({ type: String, required: true, trim: true })
  organization: string;

  @Prop({
    type: String,
    required: true,
    enum: ['employment', 'internship', 'training', 'freelance'],
  })
  type: string;

  @Prop({ type: String, default: '', trim: true })
  location: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate?: Date;

  @Prop({ type: Boolean, default: false })
  isCurrent: boolean;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  responsibilities: string[];

  @Prop({ type: [String], default: [] })
  techStack: string[];

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);