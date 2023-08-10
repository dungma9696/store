import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StatusCommon } from '../../../constants';
import { Representative } from './representative.schema';
import { AbstractSchema } from '../../../database';

export type ApartmentDocument = Apartment & Document;

@Schema({ timestamps: true })
export class Apartment extends AbstractSchema {
  @Prop({
    required: true,
    unique: true,
    maxlength: 500,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 100,
  })
  code: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
    type: Representative,
  })
  representatives: Representative[];

  @Prop({ enum: StatusCommon, default: StatusCommon.ACTIVE })
  status: StatusCommon;

  @Prop({ required: false })
  createdBy?: string;
}

export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
export default MongooseModule.forFeature([
  { name: Apartment.name, schema: ApartmentSchema },
]);
