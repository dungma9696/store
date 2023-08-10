import { Prop, Schema } from '@nestjs/mongoose';
@Schema({ _id: false, versionKey: false })
export class Representative {
  @Prop({
    required: true,
    maxlength: 500,
  })
  name: string;

  @Prop({
    required: false,
    maxlength: 50,
  })
  numberPhone?: string;

  @Prop({
    required: false,
    maxlength: 320,
  })
  email?: string;

  @Prop({
    required: false,
    maxlength: 1000,
  })
  address?: string;
}
