import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CertificateDocument = HydratedDocument<Certificate>;

@Schema({
  timestamps: true,
  collection: 'certificates',
})
export class Certificate {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true, trim: true })
  issuer: string;

  @Prop({ type: Date, required: true })
  issueDate: Date;

  @Prop({ type: Date, default: null })
  expiryDate?: Date;

  @Prop({ type: String, default: '', trim: true })
  credentialId: string;

  @Prop({ type: String, default: '', trim: true })
  credentialUrl: string;

  @Prop({ type: String, default: '' })
  imageUrl: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;
}

export const CertificateSchema =
  SchemaFactory.createForClass(Certificate);