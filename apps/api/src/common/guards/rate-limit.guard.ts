import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class SimpleRateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, { count: number; expiresAt: number }>();
  private readonly windowMs = 60 * 1000;
  private readonly maxHits = 100;

  constructor() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.hits.entries()) {
        if (now > value.expiresAt) {
          this.hits.delete(key);
        }
      }
    }, 60 * 1000).unref();
  }

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const record = this.hits.get(ip);

    if (!record || now > record.expiresAt) {
      this.hits.set(ip, { count: 1, expiresAt: now + this.windowMs });
      if (res?.setHeader) {
        res.setHeader('X-RateLimit-Limit', this.maxHits);
        res.setHeader('X-RateLimit-Remaining', this.maxHits - 1);
        res.setHeader('X-RateLimit-Reset', Math.ceil((now + this.windowMs) / 1000));
      }
      return true;
    }

    if (record.count >= this.maxHits) {
      const retryAfterSeconds = Math.max(1, Math.ceil((record.expiresAt - now) / 1000));
      if (res?.setHeader) {
        res.setHeader('Retry-After', retryAfterSeconds);
        res.setHeader('X-RateLimit-Limit', this.maxHits);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.expiresAt / 1000));
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again shortly.',
          retryAfter: retryAfterSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count += 1;
    if (res?.setHeader) {
      res.setHeader('X-RateLimit-Limit', this.maxHits);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxHits - record.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.expiresAt / 1000));
    }

    return true;
  }
}
