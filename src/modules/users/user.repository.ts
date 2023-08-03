import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongooseRepository } from '../../database';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository extends MongooseRepository<UserDocument> {
  constructor(@InjectModel(User.name) model: mongoose.Model<UserDocument>) {
    super(model);
  }
}
