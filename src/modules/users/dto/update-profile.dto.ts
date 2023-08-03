import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ obj }) => obj.email.trim())
  @IsEmail({}, { message: 'users.EMAIL_IS_INVALID' })
  email?: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.employeeName.trim())
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  employeeName: string;
}
