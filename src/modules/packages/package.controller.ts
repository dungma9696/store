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
import { PackageService } from './package.service';
import { SearchPackageDto } from './dto/search-package.dto';

@Controller('package')
@ApiTags('Packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async getPackages(@Query() query: SearchPackageDto) {
    const packageRes = await this.packageService.getList(query);

    return { data: packageRes };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.EDITOR, RoleType.VIEWER])
  async findOnePackage(@Param('id') id: string) {
    const packageRes = await this.packageService.findOneById(id);
    return { data: packageRes };
  }
}
