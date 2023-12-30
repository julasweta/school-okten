import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let userTypeAllowed = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );

    if (!userTypeAllowed) {
      userTypeAllowed = this.reflector.get<string[]>(
        'role',
        context.getClass(),
      );
      if (!userTypeAllowed) {
        return true;
      }
    }

    if (!userTypeAllowed.includes(user.role)) {
      throw new HttpException(
        'Access Token is wrong as Admin ',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
