import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageAdminController } from './package-admin.controller';
import { PackageController } from './package.controller';
import { PackageRepository } from './package.repository';
import PackageModal from './schema/package.schema';

@Module({
  imports: [PackageModal],
  controllers: [PackageAdminController, PackageController],
  providers: [PackageService, PackageRepository],
})
export class PackagesModule {}
