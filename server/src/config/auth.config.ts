import { registerAs } from '@nestjs/config';

export const authConfig = {
  cookie: {
    name: process.env.COOKIE_NAME || 'accessToken',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.COOKIE_SAME_SITE || 'strict') as
        | 'strict'
        | 'lax'
        | 'none',
      maxAge:
        parseInt(process.env.COOKIE_MAX_AGE, 10) || 1000 * 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

export default registerAs('auth', () => authConfig);
