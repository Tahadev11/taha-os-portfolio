import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({
  timestamps: true,
  collection: 'projects',
})
export class Project {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  shortDescription: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: [String],
    default: [],
  })
  techStack: string[];

  @Prop({
    type: String,
    default: '',
  })
  thumbnail: string;

  @Prop({
    type: [String],
    default: [],
  })
  gallery: string[];

  @Prop({
    type: String,
    default: '',
  })
  githubUrl: string;

  @Prop({
    type: String,
    default: '',
  })
  liveUrl: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isFeatured: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  sortOrder: number;

  @Prop({
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  })
  status: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);