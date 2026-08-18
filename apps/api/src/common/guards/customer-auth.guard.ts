import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class CustomerAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    const validatedUser = super.handleRequest(err, user, info);
    if (!validatedUser || validatedUser.type !== 'customer') {
      throw new ForbiddenException('Customer authentication required');
    }
    return validatedUser;
  }
}
