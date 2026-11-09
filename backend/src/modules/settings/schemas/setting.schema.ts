
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingDocument = HydratedDocument<Setting>;

@Schema({
  timestamps: true,
  collection: 'settings',
})
export class Setting {
  @Prop({ type: String, required: true, trim: true })
  siteTitle: string;

  @Prop({ type: String, default: '', trim: true })
  siteDescription: string;

  @Prop({ type: String, default: '', trim: true })
  seoTitle: string;

  @Prop({ type: String, default: '', trim: true })
  seoDescription: string;

  @Prop({ type: [String], default: [] })
  seoKeywords: string[];

  @Prop({ type: String, default: '' })
  logoUrl: string;

  @Prop({ type: String, default: '' })
  lightLogoUrl: string;

  @Prop({ type: String, default: '' })
  faviconUrl: string;

  @Prop({
    type: String,
    enum: ['dark', 'light', 'system'],
    default: 'dark',
  })
  theme: string;

  @Prop({
    type: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    default: {},
    _id: false,
  })
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };

  @Prop({ type: String, default: '' })
  contactEmail: string;

  @Prop({ type: String, default: '' })
  contactPhone: string;

  @Prop({ type: Boolean, default: false })
  maintenanceMode: boolean;

  @Prop({ type: Boolean, default: true })
  isWebsiteVisible: boolean;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
