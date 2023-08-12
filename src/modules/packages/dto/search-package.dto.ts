import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { QueryPaginationDto } from '../../../common/dto/query-pagination.dto';
import { RoleType, StatusCommon } from '../../../constants';

export class SearchPackageDto extends QueryPaginationDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    description: 'Search for code of apartment. Max length 250',
  })
  @IsOptional()
  @Transform(({ obj }) => obj.content.trim())
  @IsString()
  @MaxLength(250)
  content?: string = '';

  @ApiPropertyOptional({ enum: StatusCommon })
  @IsOptional()
  @IsEnum(StatusCommon)
  status?: StatusCommon;
}
