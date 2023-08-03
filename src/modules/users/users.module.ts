import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import UserModal from './user.schema';

@Module({
  imports: [UserModal],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
