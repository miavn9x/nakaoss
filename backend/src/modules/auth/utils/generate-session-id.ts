import { v4 as uuidv4 } from 'uuid';

/**
 * Tạo sessionId duy nhất (sess_...)
 */
export function generateSessionId(): string {
  return `sess_${uuidv4()}`;
}
