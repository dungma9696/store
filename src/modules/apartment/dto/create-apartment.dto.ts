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
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsCodeApartment } from '../../../decorators/code-apartment.decorator';
import { IsUserName } from '../../../decorators/user-name.decorator';
import { RepresentativeDTO } from './representative.dto';
import { StatusCommon } from '../../../constants';

export class CreateApartmentDto {
  @ApiPropertyOptional({ type: String, required: true })
  @IsOptional()
  @IsString()
  @Transform(({ obj }) => obj.code.trim())
  @MaxLength(100)
  code?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Transform(({ obj }) => obj.name.trim())
  @MaxLength(500)
  @MinLength(2)
  @IsUserName('name', { message: 'NAME_IS_INVALID' })
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  @Transform(({ obj }) => obj.address.trim())
  address: string;

  @ApiProperty({ type: RepresentativeDTO, required: true })
  @IsArray()
  @Transform(({ obj }) => obj.representatives || [])
  // @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => RepresentativeDTO)
  representatives: RepresentativeDTO[];

  @ApiProperty({ enum: StatusCommon, required: false })
  @IsNotEmpty()
  @IsEnum(StatusCommon)
  status: StatusCommon;
}
