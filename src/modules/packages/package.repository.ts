import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongooseRepository } from '../../database';
import { Package, PackageDocument } from './schema/package.schema';

@Injectable()
export class PackageRepository extends MongooseRepository<PackageDocument> {
  constructor(
    @InjectModel(Package.name) model: mongoose.Model<PackageDocument>
  ) {
    super(model);
  }
}
