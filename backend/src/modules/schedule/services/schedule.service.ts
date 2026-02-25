// --- Thư Viện NestJS & Mongoose ---
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// --- Import Nội Bộ ---
import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';
import { MediaService } from '../../media/services/media.service';
import { extractImageUrlsFromHtml } from 'src/common/utils/html.util';
import { RevalidationService } from '../../revalidation/services/revalidation.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,
    private readonly mediaService: MediaService,
    private readonly revalidationService: RevalidationService,
  ) {}

  /**
   * Tạo lịch mới (Tự động sinh Code)
   */
  async create(dto: CreateScheduleDto) {
    const now = new Date();
    const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getFullYear().toString().slice(-2)}`;
    let code = '';
    let exist = true;

    // Vòng lặp tạo mã code duy nhất: SCH + Ngày + Random
    while (exist) {
      const random = Math.floor(100000 + Math.random() * 900000);
      code = `SCH${datePart}${random}`;
      const existed = await this.scheduleModel.exists({ code }).exec();
      exist = !!existed;
    }

    const created = new this.scheduleModel({ ...dto, code });
    const saved = await created.save();

    await this.revalidationService.revalidate('schedules');

    return {
      message: 'Tạo lịch thành công',
      data: saved,
      errorCode: null,
    };
  }

  /**
   * Cập nhật thông tin lịch
   */
  async update(code: string, dto: UpdateScheduleDto) {
    const exists = await this.scheduleModel.exists({ code }).exec();
    if (!exists) {
      return {
        message: 'Không tìm thấy lịch',
        data: null,
        errorCode: 'SCHEDULE_NOT_FOUND',
      };
    }

    const updated = await this.scheduleModel.findOneAndUpdate({ code }, dto, { new: true }).exec();

    await this.revalidationService.revalidate('schedules');

    return {
      message: 'Cập nhật lịch thành công',
      data: updated,
      errorCode: null,
    };
  }

  /**
   * Tìm kiếm và lấy danh sách lịch (có phân trang)
   */
  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    // Query tìm kiếm theo title hoặc content trong mảng details
    const query = search
      ? {
          details: {
            $elemMatch: {
              $or: [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
              ],
            },
          },
        }
      : {};

    const [items, total] = await Promise.all([
      this.scheduleModel
        .find(query, 'code details createdAt updatedAt -_id')
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.scheduleModel.countDocuments(query).exec(),
    ]);

    return {
      message: 'Lấy danh sách lịch thành công',
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
        },
      },
      errorCode: null,
    };
  }

  /**
   * Lấy chi tiết một lịch theo code
   */
  async findOne(code: string) {
    const schedule = await this.scheduleModel.findOne({ code }).lean().exec();
    if (!schedule) {
      return {
        message: 'Không tìm thấy lịch',
        data: null,
        errorCode: 'SCHEDULE_NOT_FOUND',
      };
    }

    return {
      message: 'Lấy chi tiết lịch thành công',
      data: schedule,
      errorCode: null,
    };
  }

  /**
   * Xóa lịch và hình ảnh liên quan trong nội dung
   */
  async delete(code: string) {
    const schedule = await this.scheduleModel.findOne({ code }).exec();
    if (!schedule) {
      return {
        message: 'Không tìm thấy lịch',
        data: null,
        errorCode: 'SCHEDULE_NOT_FOUND',
      };
    }

    // Xóa ảnh trong nội dung HTML nếu có để dọn dẹp bộ nhớ
    if (schedule.details && Array.isArray(schedule.details)) {
      let allImageUrls: string[] = [];
      schedule.details.forEach(detail => {
        if (detail.content) {
          const urls = extractImageUrlsFromHtml(detail.content);
          allImageUrls = [...allImageUrls, ...urls];
        }
      });

      if (allImageUrls.length > 0) {
        allImageUrls = [...new Set(allImageUrls)]; // Loại bỏ trùng lặp
        await this.mediaService.deleteManyByUrls(allImageUrls);
      }
    }

    const deleted = await this.scheduleModel.findOneAndDelete({ code }).exec();

    await this.revalidationService.revalidate('schedules');

    return {
      message: 'Xoá lịch thành công',
      data: deleted,
      errorCode: null,
    };
  }
}
