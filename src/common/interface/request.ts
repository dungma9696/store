import { Request } from '@nestjs/common';
import { User } from '../../modules/users/user.schema';
export default interface IRequest extends Request {
  user: Omit<User & { _id: string }, 'password'>;
}
