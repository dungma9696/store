import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/user.repository';
import UserModal from '../users/user.schema';

@Module({
  imports: [UserModal],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
