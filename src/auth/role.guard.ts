import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userRole = request.headers['x-role'] as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = request.headers['x-user-id'] as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userEmail = request.headers['x-user-email'] as string;

    if (!userRole) {
      throw new UnauthorizedException('No role provided in headers (x-role)');
    }

    if (!userId || !userEmail) {
      throw new UnauthorizedException(
        'Missing user id or email in headers (x-user-id, x-user-email)',
      );
    }

    // Attach user object to request
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.user = {
      id: userId,
      email: userEmail,
      role: userRole,
    };

    if (requiredRoles.length === 0) return true;

    return requiredRoles.includes(userRole);
  }
}
