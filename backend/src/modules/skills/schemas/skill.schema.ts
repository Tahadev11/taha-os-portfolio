import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({
  timestamps: true,
  collection: 'skills',
})
export class Skill {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  category: string;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  })
  proficiency: number;

  @Prop({
    type: String,
    default: '',
  })
  icon: string;

  @Prop({
    type: Number,
    default: 0,
  })
  sortOrder: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isVisible: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);