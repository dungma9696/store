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
import { IsNumberPhone } from '../../../decorators/number-phone.decorator';

import { RoleType, StatusCommon } from '../../../constants';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.userName.trim())
  @MaxLength(500)
  @MinLength(5)
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @Transform(({ obj }) => obj.address.trim())
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.numberPhone.trim())
  @MaxLength(20)
  @MinLength(8)
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'INVALID_PHONE_NUMBER',
  })
  @IsNumberPhone('numberPhone', { message: 'NUMBER_PHONE_IS_INVALID' })
  numberPhone: string;

  @ApiProperty({ enum: RoleType })
  @IsNotEmpty()
  @IsEnum(RoleType)
  role: RoleType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => obj.email.trim())
  @IsEmail({}, { message: 'EMAIL_IS_INVALID' })
  email?: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.password.trim())
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~])[A-Za-z\d !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]{8,20}$/,
    {
      message: 'PASSWORD_INVALID',
    }
  )
  password: string;

  @ApiProperty({ enum: StatusCommon })
  @IsNotEmpty()
  @IsEnum(StatusCommon)
  status: StatusCommon;
}
