import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import constants from '../common/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private protectionType: string = constants.AUTH_GUARD_TYPES_ENUM.AUTHORIZED,
  ) {
    super();
  }

  handleRequest<IUser>(error, user): IUser {
    if (error) {
      throw error;
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      this.protectionType === constants.AUTH_GUARD_TYPES_ENUM.ADMIN &&
      !user.isAdmin
    ) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
