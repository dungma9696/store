import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators/auth.decorator';
import { ApartmentsService } from './apartments.service';
import { SearchApartmentDto } from './dto/search-apartment.dto';

@Controller('apartments')
@ApiTags('Apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async getApartments(@Query() query: SearchApartmentDto) {
    const apartment = await this.apartmentsService.getList(query);

    return { data: apartment };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async findOneApartment(@Param('id') id: string) {
    const apartment = await this.apartmentsService.findOneById(id);
    return { data: apartment };
  }
}
