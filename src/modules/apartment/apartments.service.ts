import { BadRequestException, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { PaginationResult } from '../../interfaces';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { SearchApartmentDto } from './dto/search-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { ApartmentsRepository } from './apartment.repository';
import { Apartment } from './schema/apartment.schema';

@Injectable()
export class ApartmentsService {
  constructor(private readonly apartmentsRepository: ApartmentsRepository) {}

  async create(
    createApartmentDto: CreateApartmentDto & { createdBy: string }
  ): Promise<Apartment> {
    const { name } = createApartmentDto;
    const randomNumber = Math.floor(Math.random() * 99999);
    const randomNumberConvert = new Array(5 - randomNumber.toString().length)
      .fill('0')
      .join();
    const newCode =
      name
        .split(' ')
        .filter((i) => !!i.trim())
        ?.map((item) => item.charAt(0).toLocaleUpperCase())
        .join('') + randomNumberConvert;

    const apartmentExisted = await this.apartmentsRepository.TSchema.findOne({
      code: newCode,
    });

    if (apartmentExisted) {
      throw new BadRequestException('CODE_IS_EXISTED');
    }

    createApartmentDto.code = newCode;

    const apartmentSaved = await this.apartmentsRepository.TSchema.create(
      createApartmentDto
    );

    return apartmentSaved;
  }

  getList(query: SearchApartmentDto): Promise<PaginationResult<Apartment>> {
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
              code: { $regex: content, $options: 'i' },
            },
            {
              name: { $regex: content, $options: 'i' },
            },
            {
              address: { $regex: content, $options: 'i' },
            },
          ],
        },
        ...queryAnd,
      ],
    };

    return this.apartmentsRepository.list({
      limit,
      page,
      condition,
    });
  }

  async findOneById(id: string): Promise<Apartment> {
    const apartment = await this.apartmentsRepository.TSchema.findById(id);
    if (!apartment) {
      throw new BadRequestException('APARTMENT_NOT_EXIST');
    }

    return apartment;
  }

  async update(
    id: string,
    updateApartmentDto: UpdateApartmentDto
  ): Promise<Apartment> {
    const apartmentExisted = await this.apartmentsRepository.TSchema.findById(
      id
    );
    if (!apartmentExisted) {
      throw new BadRequestException('APARTMENT_NOT_EXIST');
    }

    apartmentExisted.representatives = updateApartmentDto.representatives;
    apartmentExisted.address = updateApartmentDto.address;
    apartmentExisted.name = updateApartmentDto.name;
    apartmentExisted.status = updateApartmentDto.status;
    const apartmentSaved = await this.apartmentsRepository.TSchema.create(
      apartmentExisted
    );
    return apartmentSaved;
  }

  async removeById(id: string): Promise<Apartment> {
    const apartment = await this.apartmentsRepository.TSchema.findById(id);
    if (!apartment) {
      throw new BadRequestException('APARTMENT_NOT_EXIST');
    }
    return null;
  }
}
