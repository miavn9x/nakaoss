import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // Nếu có lỗi hoặc không có user, chỉ đơn giản trả về null thay vì Throw Exception
    if (err || !user) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
