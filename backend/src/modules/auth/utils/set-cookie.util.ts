import { Response } from 'express';

/**
 * Thiết lập cookie chứa accessToken và refreshToken
 * Tự động xử lý Secure/SameSite dựa trên môi trường
 */
export function setAuthCookies(
  res: Response,
  tokens: { accessToken?: string; refreshToken?: string },
  accessMaxAge: number,
  refreshMaxAge: number,
) {
  const isProd = process.env.NODE_ENV === 'production';
  // HTTPS development mode
  const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';

  // Secure: Bắt buộc khi ở Production hoặc Force Enable
  const useSecure = isProd || forceSecure;

  // SameSite: 'lax' là lựa chọn an toàn nhất để chống CSRF (mặc định cho các trình duyệt hiện đại)
  const sameSiteValue: 'none' | 'lax' | 'strict' = 'lax';

  if (tokens.refreshToken) {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: sameSiteValue,
      maxAge: refreshMaxAge,
      path: '/',
    });
  }

  if (tokens.accessToken) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: useSecure,
      sameSite: sameSiteValue,
      maxAge: accessMaxAge,
      path: '/',
    });
  }
}
