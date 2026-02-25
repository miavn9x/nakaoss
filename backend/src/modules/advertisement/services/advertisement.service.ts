import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertisement, AdvertisementDocument } from '../schemas/advertisement.schema';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../dtos/update-advertisement.dto';
import { RevalidationService } from '../../revalidation/services/revalidation.service';

import { GetAdvertisementsDto } from '../dtos/get-advertisements.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(Advertisement.name)
    private readonly adModel: Model<AdvertisementDocument>,
    private readonly revalidationService: RevalidationService,
  ) {}

  /**
   * Tạo quảng cáo mới
   * Nếu active banner mới, sẽ tự động deactivate các banner khác cùng vị trí (độc quyền vị trí)
   */
  async create(dto: CreateAdvertisementDto) {
    const code = `ADV${Date.now()}`;

    // Logic: Mỗi vị trí chỉ cho phép 1 banner active
    // Nếu banner mới là active, deactivate các banner cũ cùng position
    if (dto.isActive === true) {
      await this.adModel.updateMany({ position: dto.position }, { isActive: false }).exec();
    }

    const created = new this.adModel({ ...dto, code });
    const saved = await created.save();

    // Trigger revalidation
    await this.revalidationService.revalidate('ads');

    return {
      message: 'Tạo quảng cáo thành công',
      data: saved,
      errorCode: null,
    };
  }

  /**
   * Lấy danh sách quảng cáo (có hỗ trợ filter)
   */
  async findAll(query: GetAdvertisementsDto) {
    const filter: Record<string, any> = {};

    if (query.position) {
      filter.position = query.position;
    }
    // Chuyển đổi string 'true'/'false' sang boolean nếu cần thiết, hoặc so sánh trực tiếp
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    const items = await this.adModel
      .find(filter)
      .sort({ priority: -1, updatedAt: -1 }) // Ưu tiên cao nhất và mới nhất
      .exec();

    return {
      message: 'Lấy danh sách quảng cáo thành công',
      data: items,
      errorCode: null,
    };
  }

  /**
   * Lấy chi tiết quảng cáo theo mã
   */
  async findOne(code: string) {
    const item = await this.adModel.findOne({ code }).exec();
    if (!item) {
      throw new NotFoundException('Không tìm thấy quảng cáo');
    }
    return {
      message: 'Lấy chi tiết quảng cáo thành công',
      data: item,
      errorCode: null,
    };
  }

  /**
   * Cập nhật thông tin quảng cáo
   */
  async update(code: string, dto: UpdateAdvertisementDto) {
    // Nếu active banner này, cần tắt các banner khác cùng vị trí
    if (dto.isActive === true) {
      const currentAd = await this.adModel.findOne({ code }).exec();

      if (currentAd) {
        // Deactivate tất cả banner khác cùng position
        await this.adModel
          .updateMany(
            {
              position: currentAd.position,
              code: { $ne: code }, // Loại trừ banner đang update
            },
            { isActive: false },
          )
          .exec();
      }
    }

    const updated = await this.adModel.findOneAndUpdate({ code }, dto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Không tìm thấy quảng cáo để cập nhật');
    }

    // Trigger revalidation
    await this.revalidationService.revalidate('ads');

    return {
      message: 'Cập nhật quảng cáo thành công',
      data: updated,
      errorCode: null,
    };
  }

  /**
   * Xóa quảng cáo
   */
  async delete(code: string) {
    const deleted = await this.adModel.findOneAndDelete({ code }).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy quảng cáo để xóa');
    }

    await this.revalidationService.revalidate('ads');

    return {
      message: 'Xóa quảng cáo thành công',
      data: deleted,
      errorCode: null,
    };
  }
}
