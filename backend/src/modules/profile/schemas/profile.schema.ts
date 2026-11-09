import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({
  timestamps: true,
  collection: 'profiles',
})
export class Profile {
  @Prop({ type: String, required: true, trim: true })
  fullName: string;

  @Prop({ type: String, required: true, trim: true })
  professionalTitle: string;

  @Prop({ type: String, default: '' })
  shortIntro: string;

  @Prop({ type: String, default: '' })
  about: string;

  @Prop({ type: String, default: '' })
  profileImage: string;

  @Prop({ type: String, default: '' })
  location: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, default: '' })
  phone: string;

  @Prop({
    type: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    default: {},
  })
  socialLinks: {
    github: string;
    linkedin: string;
    website: string;
  };

  @Prop({ type: String, default: '' })
  resumeUrl: string;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);