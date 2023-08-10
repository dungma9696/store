import { Module } from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { ApartmentsAdminController } from './apartment-admin.controller';
import { ApartmentsController } from './apartment.controller';
import { ApartmentsRepository } from './apartment.repository';
import ApartmentModal from './schema/apartment.schema';

@Module({
  imports: [ApartmentModal],
  controllers: [ApartmentsAdminController, ApartmentsController],
  providers: [ApartmentsService, ApartmentsRepository],
})
export class ApartmentsModule {}
