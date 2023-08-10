import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateApartmentDto } from './dto/create-apartment.dto';
import { ApartmentsService } from './apartments.service';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/auth.decorator';
import IRequest from '../../common/interface/request';
import { SearchApartmentDto } from './dto/search-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';

@Controller('admin/apartments')
@ApiTags('Admin apartments')
export class ApartmentsAdminController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateApartmentDto,
    description: 'Create a new apartment body',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a new apartment successfully',
  })
  @ApiBadRequestResponse({
    description: 'Existed account',
  })
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async createNewApartment(
    @Body() createApartmentDto: CreateApartmentDto,
    @Req() request: IRequest
  ) {
    const apartment = await this.apartmentsService.create({
      ...createApartmentDto,
      createdBy: request?.user?._id || '',
    });
    return {
      message: await 'CREATE_APARTMENT_SUCCESSFULLY',
      data: apartment,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async getApartments(@Query() query: SearchApartmentDto) {
    const apartment = await this.apartmentsService.getList(query);

    return { data: apartment };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async findOneApartment(@Param('id') id: string) {
    const apartment = await this.apartmentsService.findOneById(id);
    return { data: apartment };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async updateApartment(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto
  ) {
    const apartment = await this.apartmentsService.update(
      id,
      updateApartmentDto
    );
    return {
      message: 'common.UPDATE_SUCCESS',
      data: apartment,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async removeApartment(@Param('id') id: string) {
    await this.apartmentsService.removeById(id);
    return {
      message: await 'DELETE_SUCCESS',
    };
  }
}
