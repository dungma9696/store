import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserName } from '../../../decorators/user-name.decorator';

import { RoleType, StatusCommon } from '../../../constants';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.userName.trim())
  @MaxLength(20)
  @MinLength(5)
  @IsUserName('userName', { message: 'users.USER_NAME_IS_INVALID' })
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  @Transform(({ obj }) => obj.employeeName.trim())
  employeeName: string;

  @ApiProperty({ enum: RoleType })
  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => obj.email.trim())
  @IsEmail({}, { message: 'users.EMAIL_IS_INVALID' })
  email?: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.password.trim())
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]{8,20}$/,
    {
      message: 'users.PASSWORD_INVALID',
    },
  )
  password: string;

  @ApiProperty({ enum: StatusCommon })
  @IsNotEmpty()
  @IsEnum(StatusCommon)
  status: StatusCommon;
}
