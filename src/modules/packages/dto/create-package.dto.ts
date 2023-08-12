import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsNotEmptyObject,
  IsArray,
  ValidateNested,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUserName } from '../../../decorators/user-name.decorator';
import { StatusCommon } from '../../../constants';

export class CreatePackageDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.name.trim())
  @MaxLength(1000)
  @MinLength(2)
  @IsUserName('name', { message: 'NAME_IS_INVALID' })
  name: string;

  @ApiProperty({ type: 'number', required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  numberProduct: number;

  @ApiProperty({ type: 'number', required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  fee: number;

  @ApiProperty({ enum: StatusCommon, required: true })
  @IsNotEmpty()
  @IsEnum(StatusCommon)
  status: StatusCommon;
}
