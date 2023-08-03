import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/auth.decorator';
// import { SearchUserDto } from './dto/search-user.dto';
import IRequest from '../../common/interface/request';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserChangePasswordDTO } from './dto/user-change-password.dto';
// import { AdminResetUserPasswordDTO } from './dto/admin-reset-password.dto';

@Controller('admin/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: CreateUserDto, description: 'Create a new user body' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a new user successfully',
  })
  @ApiBadRequestResponse({
    description: 'Existed account with email',
  })
  // @Auth([RoleType.ADMIN])
  async createNewUser(
    @Body() createUserDto: CreateUserDto,
    @Req() request: IRequest,
  ) {
    const user = await this.usersService.createNewUser({
      ...createUserDto,
      createdBy: request?.user?._id || '',
    });
    return {
      message: await 'users.CREATE_USER_SUCCESSFULLY',
      data: user,
    };
  }

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.ADMIN])
  // getUsers(@Query() query: SearchUserDto) {
  //   return this.usersService.getUsers(query);
  // }

  @Get('/my-profile')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  getProfile(@Req() request) {
    return this.usersService.findOneUser(request.user._id);
  }

  @Put('/my-profile')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async updateProfile(
    @Body() updateUserDto: UpdateProfileDto,
    @Req() request: IRequest,
  ) {
    const user = await this.usersService.updateProfile(
      request.user._id,
      updateUserDto,
    );
    return {
      data: user,
    };
  }

  @Put('/me/change-password')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async changePassword(
    @Body() userChangePassword: UserChangePasswordDTO,
    @Req() request: IRequest,
  ) {
    await this.usersService.changePassword(
      request.user._id,
      userChangePassword,
    );
    return {
      message: await 'common.UPDATE_SUCCESS',
    };
  }

  // @Post('/:id/reset-password')
  // @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.ADMIN])
  // async adminResetUserPassword(
  //   @Param('id') id: string,
  //   @I18n() i18n: I18nContext,
  //   @Body() userChangePassword: AdminResetUserPasswordDTO,
  // ) {
  //   await this.usersService.adminResetPassword(id, userChangePassword);
  //   return {
  //     message: await i18n.t('users.RESET_USER_PASSWORD_SUCCESS'),
  //   };
  // }

  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.ADMIN])
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOneUser(id);
  // }

  // @Put(':id')
  // @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.ADMIN])
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   const user = await this.usersService.updateUser(id, updateUserDto);
  //   return {
  //     data: user,
  //   };
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // @Auth([RoleType.ADMIN])
  // async removeUser(@Param('id') id: string, @I18n() i18n: I18nContext) {
  //   await this.usersService.removeUser(id);
  //   return {
  //     message: await i18n.t('users.USER_DELETE_SUCCESSFULLY', {
  //       args: { id },
  //     }),
  //   };
  // }
}
