// --- Import Thư Viện Test ---
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- Unit Test: AppController ---
describe('AppController', () => {
  let appController: AppController;

  // 1. Cấu Hình Module Test
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // 2. Các Trường Hợp Test
  describe('root', () => {
    it('should return "Welcome to Bánh Tránh API!"', () => {
      // Kỳ Vọng Phản Hồi
      expect(appController.getHello()).toBe('Welcome to Bánh Tránh API!');
    });
  });
});
