import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleType } from '../constants';
import { AuthGuard, RolesGuard } from '../guards';

export function Auth(roles: RoleType[] = []): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
