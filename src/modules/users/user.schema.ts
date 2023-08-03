import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { RoleType, StatusCommon } from '../../constants';
import { AbstractSchema } from '../../database';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends AbstractSchema {
  @Prop({
    required: true,
    unique: true,
    maxlength: 20,
  })
  userName: string;

  @Prop({
    required: true,
  })
  employeeName: string;

  @Prop({
    enum: RoleType,
    default: RoleType.VIEWER,
  })
  role: RoleType;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: StatusCommon, default: StatusCommon.ACTIVE })
  status: StatusCommon;

  @Prop({ required: false })
  createdBy?: string;

  // eslint-disable-next-line @typescript-eslint/ban-types
  comparePassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);
export default MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = function (password: string) {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
};
