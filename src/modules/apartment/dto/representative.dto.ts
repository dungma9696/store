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

export class RepresentativeDTO {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.name.trim())
  @MaxLength(500)
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ type: String, required: false })
  @IsOptional()
  @Transform(({ obj }) => obj.email.trim())
  @IsEmail({}, { message: 'users.EMAIL_IS_INVALID' })
  email?: string;

  @ApiProperty({ type: String, required: false })
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, {
    message: 'INVALID_PHONE_NUMBER',
  })
  @MaxLength(100)
  @IsOptional()
  numberPhone?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @IsOptional()
  @IsString()
  @Transform(({ obj }) => obj.address.trim())
  @MaxLength(1000)
  address?: string;
}
