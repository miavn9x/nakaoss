/**
 * Interface cho dữ liệu email xác thực quyền
 */
export interface RoleVerificationMailData {
  email: string;
  fullName: string;
  role: string;
  token: string;
  userId: string;
  frontendUrl?: string;
}
