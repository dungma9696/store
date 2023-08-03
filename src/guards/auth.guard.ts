import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import CONFIG from '../configs/app.config';
import { User } from '../modules/users/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers['authorization'];

    if (!bearerToken) {
      throw new UnauthorizedException('auth.UNAUTHORIZED');
    }

    const token = bearerToken.split(' ')[1];
    let decode: { data: User };
    jwt.verify(
      token,
      CONFIG.ENV.SHARE.SECURE.JWT.JWT_SECRET,
      (_err: jwt.VerifyErrors, decoded: undefined) => {
        if (decoded) {
          decode = decoded;
        } else {
          throw new UnauthorizedException('auth.UNAUTHORIZED');
        }
      },
    );
    if (decode) {
      request.user = decode.data;
      return true;
    }
    return false;
  }
}
