import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StatusCommon } from '../../../constants';
import { AbstractSchema } from '../../../database';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package extends AbstractSchema {
  @Prop({
    required: true,
    unique: true,
    maxlength: 1000,
  })
  name: string;

  @Prop({
    required: true,
  })
  numberProduct: number;

  @Prop({
    required: true,
  })
  fee: number;

  @Prop({ enum: StatusCommon, default: StatusCommon.ACTIVE })
  status: StatusCommon;

  @Prop({ required: false })
  createdBy?: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
export default MongooseModule.forFeature([
  { name: Package.name, schema: PackageSchema },
]);
