import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { PaginationResult } from '../../interfaces';
import { AdminResetUserPasswordDTO } from './dto/admin-reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserChangePasswordDTO } from './dto/user-change-password.dto';
import { UsersRepository } from './user.repository';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createNewUser(
    createUserDto: CreateUserDto & { createdBy: string }
  ): Promise<User> {
    const { numberPhone } = createUserDto;
    const userExisted = await this.userRepository.TSchema.findOne({
      numberPhone,
    });

    if (userExisted) {
      throw new BadRequestException('users.NUMBER_PHONE_IS_EXISTED');
    }

    const userSaved = await this.userRepository.TSchema.create(createUserDto);
    const userResponse = omit(userSaved.toObject(), ['password']);

    return userResponse;
  }

  getUsers(query: SearchUserDto): Promise<PaginationResult<User>> {
    const { limit, page, content, status, role } = query;
    const queryAnd = [];

    if (status) {
      queryAnd.push({ status });
    }
    if (role) {
      queryAnd.push({ role });
    }

    const condition = {
      $and: [
        {
          $or: [
            {
              userName: { $regex: content, $options: 'i' },
            },
            {
              employeeName: { $regex: content, $options: 'i' },
            },
          ],
        },
        ...queryAnd,
      ],
    };

    return this.userRepository.list({
      limit,
      page,
      condition,
      projection: { password: 0 },
    });
  }

  async findOneUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.TSchema.findById(id, {
      password: 0,
    });
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.TSchema.findById(id);
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }

    user.email = updateUserDto.email;
    // user.employeeName = updateUserDto.employeeName;
    user.status = updateUserDto.status;
    user.role = updateUserDto.role;
    const userSaved = await this.userRepository.TSchema.create(user);
    return userSaved;
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.TSchema.findById(id);
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }

    user.email = updateUserDto.email;
    // user.employeeName = updateUserDto.employeeName;
    const userSaved = await this.userRepository.TSchema.create(user);
    return userSaved;
  }

  async removeUser(id: string): Promise<User> {
    const user = await this.userRepository.TSchema.findById(id);
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }
    // return this.userRepository.TSchema.remove(user);
    return null;
  }

  async changePassword(
    id: string,
    updateUserDto: UserChangePasswordDTO
  ): Promise<User> {
    const user = await this.userRepository.TSchema.findById(id);
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }

    const isOldPassword = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password
    );

    if (!isOldPassword) {
      throw new BadRequestException('users.CURRENT_PASSWORD_IS_INCORRECT');
    }

    user.password = updateUserDto.newPassword;
    return this.userRepository.TSchema.create(user);
  }

  async adminResetPassword(
    id: string,
    updateUserDto: AdminResetUserPasswordDTO
  ): Promise<User> {
    const user = await this.userRepository.TSchema.findById(id);
    if (!user) {
      throw new BadRequestException('users.USER_NOT_EXIST');
    }
    user.password = updateUserDto.newPassword;
    return this.userRepository.TSchema.create(user);
  }
}
