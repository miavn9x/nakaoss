import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBannerDto } from '../dtos/create-banner.dto';
import { UpdateBannerDto } from '../dtos/update-banner.dto';
import { Banner, BannerDocument } from '../schemas/banner.schema';

import { MediaService } from '../../media/services/media.service';
import { extractImageUrlsFromHtml } from 'src/common/utils/html.util';
import { RevalidationService } from '../../revalidation/services/revalidation.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    private readonly mediaService: MediaService,
    private readonly revalidationService: RevalidationService,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<any> {
    const now = new Date();
    const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getFullYear().toString().slice(-2)}`;
    let code = '';
    let exist = true;

    while (exist) {
      const random = Math.floor(100000 + Math.random() * 900000);
      code = `BN${datePart}${random}`;
      const existed = await this.bannerModel.exists({ code }).exec();
      exist = !!existed;
    }

    const createdBanner = new this.bannerModel({ ...createBannerDto, code });
    const saved = await createdBanner.save();

    await this.revalidationService.revalidate('banners');

    return {
      message: 'Tạo banner thành công',
      data: saved,
      errorCode: null,
    };
  }

  async findAllAdmin(): Promise<any> {
    const banners = await this.bannerModel.find().sort({ order: 1, createdAt: -1 }).exec();
    return {
      message: 'Lấy danh sách banner thành công',
      data: banners,
      errorCode: null,
    };
  }

  async findAllPublic(): Promise<any> {
    const banners = await this.bannerModel
      .find({ isVisible: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
    return {
      message: 'Lấy danh sách banner thành công',
      data: banners,
      errorCode: null,
    };
  }

  async findOne(code: string): Promise<any> {
    const banner = await this.bannerModel.findOne({ code }).exec();
    if (!banner) {
      return {
        message: 'Banner không tồn tại',
        data: null,
        errorCode: 'BANNER_NOT_FOUND',
      };
    }
    return {
      message: 'Lấy chi tiết banner thành công',
      data: banner,
      errorCode: null,
    };
  }

  async update(code: string, updateBannerDto: UpdateBannerDto): Promise<any> {
    const existingBanner = await this.bannerModel
      .findOneAndUpdate({ code }, updateBannerDto, { new: true })
      .exec();

    if (!existingBanner) {
      return {
        message: 'Banner không tồn tại',
        data: null,
        errorCode: 'BANNER_NOT_FOUND',
      };
    }

    await this.revalidationService.revalidate('banners');

    return {
      message: 'Cập nhật banner thành công',
      data: existingBanner,
      errorCode: null,
    };
  }

  async remove(code: string): Promise<any> {
    const banner = await this.bannerModel.findOne({ code }).exec();
    if (!banner) {
      return {
        message: 'Banner không tồn tại',
        data: null,
        errorCode: 'BANNER_NOT_FOUND',
      };
    }

    // Xoá ảnh vật lý nếu có (Ảnh cover)
    if (banner.imageMediaCode) {
      await this.mediaService.deleteMedia(banner.imageMediaCode);
    }

    // Xoá ảnh trong nội dung (SunEditor) - Dựa vào field 'title' vì đang dùng SunEditor
    if (banner.title) {
      const imageUrls = extractImageUrlsFromHtml(banner.title);
      await this.mediaService.deleteManyByUrls(imageUrls);
    }

    const deletedBanner = await this.bannerModel.findOneAndDelete({ code }).exec();

    await this.revalidationService.revalidate('banners');

    return {
      message: 'Xoá banner thành công',
      data: deletedBanner,
      errorCode: null,
    };
  }
}
