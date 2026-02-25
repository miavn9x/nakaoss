import { IsNotEmpty } from 'class-validator';

/**
 * DTO Tạo Lịch Mới
 */
export class CreateScheduleDto {
  @IsNotEmpty()
  details: { lang: string; title: string; content: string }[];
}
