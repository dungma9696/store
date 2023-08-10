import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString({})
  numberPhone: string;

  @ApiProperty()
  @IsString({
    message: 'PASSWORD_IS_REQUIRED',
  })
  password: string;
}
