import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsOptional } from 'class-validator';

/**
 * DTO Cập Nhật Lịch (Kế thừa từ CreateScheduleDto)
 */
export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @IsOptional()
  details?: { lang: string; title: string; content: string }[];
}
