import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationResult } from '../../interfaces';
import { CreatePackageDto } from './dto/create-package.dto';
import { SearchPackageDto } from './dto/search-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageRepository } from './package.repository';
import { Package } from './schema/package.schema';

@Injectable()
export class PackageService {
  constructor(private readonly packageRepository: PackageRepository) {}

  async create(
    createPackageDto: CreatePackageDto & { createdBy: string }
  ): Promise<Package> {
    const { name } = createPackageDto;

    const packageExisted = await this.packageRepository.TSchema.findOne({
      name,
    });

    if (packageExisted) {
      throw new BadRequestException('PACKAGE_IS_EXISTED');
    }

    const packageSaved = await this.packageRepository.TSchema.create(
      createPackageDto
    );

    return packageSaved;
  }

  getList(query: SearchPackageDto): Promise<PaginationResult<Package>> {
    const { limit, page, content, status } = query;
    const queryAnd = [];

    if (status) {
      queryAnd.push({ status });
    }

    const condition = {
      $and: [
        {
          $or: [
            {
              name: { $regex: content, $options: 'i' },
            },
          ],
        },
        ...queryAnd,
      ],
    };

    return this.packageRepository.list({
      limit,
      page,
      condition,
    });
  }

  async findOneById(id: string): Promise<Package> {
    const packageRes = await this.packageRepository.TSchema.findById(id);
    if (!packageRes) {
      throw new BadRequestException('PACKAGE_NOT_EXIST');
    }

    return packageRes;
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto
  ): Promise<Package> {
    const packageExisted = await this.packageRepository.TSchema.findById(id);
    if (!packageExisted) {
      throw new BadRequestException('PACKAGE_NOT_EXIST');
    }

    packageExisted.name = updatePackageDto.name;
    packageExisted.numberProduct = updatePackageDto.numberProduct;
    packageExisted.fee = updatePackageDto.fee;
    packageExisted.status = updatePackageDto.status;
    const packageSaved = await this.packageRepository.TSchema.create(
      packageExisted
    );
    return packageSaved;
  }

  async removeById(id: string): Promise<Package> {
    const packageRes = await this.packageRepository.TSchema.findById(id);
    if (!packageRes) {
      throw new BadRequestException('PACKAGE_NOT_EXIST');
    }
    return null;
  }
}
