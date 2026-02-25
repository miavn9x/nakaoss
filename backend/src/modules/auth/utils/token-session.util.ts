import { JwtService } from '../../../common/jwt/services/jwt.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { AuthSessionDocument } from '../schemas/auth.schema';
import { generateSessionId } from './generate-session-id';

// Interface tham số cho việc tạo Session
interface CreateTokenSessionParams {
  user: UserDocument;
  jwtService: JwtService;
  authSessionModel: {
    create: (input: Partial<AuthSessionDocument>) => Promise<AuthSessionDocument>;
  };
  ipAddress?: string;
  userAgent?: string;
  device?: { vendor?: string; model?: string; type?: string };
  os?: { name?: string; version?: string };
  browser?: { name?: string; version?: string };
}

/**
 * Tạo Access/Refresh Tokens và lưu Session vào DB
 */
export async function createTokenAndSession({
  user,
  jwtService,
  authSessionModel,
  ipAddress,
  userAgent,
  device,
  os,
  browser,
}: CreateTokenSessionParams) {
  const sessionId = generateSessionId();

  const payload = {
    sub: user._id.toString(),
    sessionId,
    email: user.email,
    roles: user.roles,
  };

  const { accessToken, refreshToken } = jwtService.signTokens(payload);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + jwtService.getRefreshExpiresInMs());

  // Lưu session mới
  await authSessionModel.create({
    sessionId,
    email: user.email,
    userId: user._id,
    refreshToken,
    ipAddress,
    userAgent,
    device,
    os,
    browser,
    loginAt: now,
    lastRefreshedAt: now,
    expiresAt,
  });

  return { accessToken, refreshToken, sessionId };
}
