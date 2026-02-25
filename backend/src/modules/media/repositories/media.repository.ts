// --- Thư Viện NestJS & Mongoose ---
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from 'src/modules/media/schemas/media.schema';

@Injectable()
export class MediaRepository {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<MediaDocument>,
  ) {}

  /**
   * Tạo media mới
   */
  async create(media: Partial<Media>): Promise<Media> {
    return this.mediaModel.create(media);
  }

  /**
   * Tạo nhiều media cùng lúc
   */
  async insertMany(mediaList: Partial<Media>[]): Promise<Media[]> {
    return this.mediaModel.insertMany(mediaList).then(docs => docs.map(doc => doc.toObject()));
  }

  /**
   * Tìm kiếm một media theo điều kiện
   */
  async findOne(condition: Partial<Media>): Promise<Media | null> {
    return this.mediaModel.findOne(condition).lean().exec();
  }

  /**
   * Xóa cứng một record
   */
  async deleteOne(condition: Partial<Media>): Promise<void> {
    await this.mediaModel.deleteOne(condition).exec();
  }

  /**
   * Xóa cứng nhiều record
   */
  async deleteMany(condition: any): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.mediaModel.deleteMany(condition).exec();
  }
}
