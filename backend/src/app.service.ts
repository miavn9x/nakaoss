// --- Import Thư Viện ---
import { Injectable } from '@nestjs/common';

// --- Service Chính ---
@Injectable()
export class AppService {
  // Phương thức mẫu (Health Check)
  getHello(): string {
    return 'Welcome to Pc API!';
  }
}
