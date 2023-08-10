import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongooseRepository } from '../../database';
import { Apartment, ApartmentDocument } from './schema/apartment.schema';

@Injectable()
export class ApartmentsRepository extends MongooseRepository<ApartmentDocument> {
  constructor(
    @InjectModel(Apartment.name) model: mongoose.Model<ApartmentDocument>
  ) {
    super(model);
  }
}
