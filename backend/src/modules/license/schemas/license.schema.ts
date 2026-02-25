import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LicenseDocument = License & Document;

@Schema({ timestamps: true })
export class License {
  @Prop({ required: true, unique: true })
  licenseKey: string;

  @Prop({ required: true })
  productCode: string;

  @Prop({ required: true, default: 'active' })
  status: string;

  @Prop()
  licenseeName: string;

  @Prop()
  licenseeEmail: string;

  @Prop({ type: Object })
  rawResponse: any;

  @Prop({ default: Date.now })
  lastCheck: Date;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
