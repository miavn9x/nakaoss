// --- Import Decorators ---
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// --- Controller Chính ---
@Controller()
export class AppController {
  // 1. Dependency Injection (Tiêm Dịch Vụ)
  constructor(private readonly appService: AppService) {}

  // 2. Xử Lý Route
  @Get() // GET /api/
  getHello(): string {
    return this.appService.getHello();
  }
}
