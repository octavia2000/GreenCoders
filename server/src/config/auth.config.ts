import { registerAs } from '@nestjs/config';

// Direct export for backward compatibility (used in strategies, helpers)
export const authConfig = {
  cookie: {
    name: process.env.COOKIE_NAME || 'Auth',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAME_SITE || 'lax') as 'strict' | 'lax' | 'none',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10) || 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

// NestJS ConfigModule integration (for services using ConfigService)
export default registerAs('auth', () => authConfig);