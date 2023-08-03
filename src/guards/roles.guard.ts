import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../modules/users/user.schema';
import { RoleType } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());

    if (roles.length == 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('auth.FORBIDDEN_RESOURCE');
    }

    return true;
  }
}
