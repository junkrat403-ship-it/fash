import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class SimpleRateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, { count: number; expiresAt: number }>();
  private readonly windowMs = 60 * 1000; // 1 minute window
  private readonly maxHits = 30; // Max 30 requests per minute per IP

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    const record = this.hits.get(ip);

    if (!record || now > record.expiresAt) {
      this.hits.set(ip, { count: 1, expiresAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxHits) {
      throw new HttpException(
        'Too many requests. Please try again in a minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count += 1;
    return true;
  }
}
