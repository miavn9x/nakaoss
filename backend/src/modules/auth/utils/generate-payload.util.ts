import { UserDocument } from '../../users/schemas/user.schema';

/**
 * Tạo payload cho JWT từ User
 */
export const generateJwtPayload = (user: UserDocument, sessionId: string) => ({
  sub: user._id.toString(),
  sessionId,
  email: user.email,
  roles: user.roles,
});
