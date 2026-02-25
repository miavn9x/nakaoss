import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertisementDto } from './create-advertisement.dto';

/**
 * DTO cập nhật quảng cáo (kế thừa từ CreateAdvertisementDto)
 */
export class UpdateAdvertisementDto extends PartialType(CreateAdvertisementDto) {}
