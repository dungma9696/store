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

import { CreatePackageDto } from './dto/create-package.dto';
import { PackageService } from './package.service';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/auth.decorator';
import IRequest from '../../common/interface/request';
import { SearchPackageDto } from './dto/search-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('admin/package')
@ApiTags('Admin package')
export class PackageAdminController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreatePackageDto,
    description: 'Create a new package body',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a new package successfully',
  })
  @ApiBadRequestResponse({
    description: 'Existed account',
  })
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async createNewPackage(
    @Body() createPackageDto: CreatePackageDto,
    @Req() request: IRequest
  ) {
    const packageRes = await this.packageService.create({
      ...createPackageDto,
      createdBy: request?.user?._id || '',
    });
    return {
      message: await 'CREATE_PACKAGE_SUCCESSFULLY',
      data: packageRes,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async getPackages(@Query() query: SearchPackageDto) {
    const packageRes = await this.packageService.getList(query);

    return { data: packageRes };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async findOnePackage(@Param('id') id: string) {
    const packageRes = await this.packageService.findOneById(id);
    return { data: packageRes };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async updatePackage(
    @Param('id') id: string,
    @Body() updatePackageDto: UpdatePackageDto
  ) {
    const packageRes = await this.packageService.update(id, updatePackageDto);
    return {
      message: 'UPDATE_SUCCESS',
      data: packageRes,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR])
  async removePackage(@Param('id') id: string) {
    await this.packageService.removeById(id);
    return {
      message: await 'DELETE_SUCCESS',
    };
  }
}
