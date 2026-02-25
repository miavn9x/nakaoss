// --- Thư Viện NestJS & Node ---
import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

// --- Import Nội Bộ ---
import { FileMetadata } from 'src/common/interfaces/upload.interface';
import { MediaRepository } from 'src/modules/media/repositories/media.repository';
import { MediaExtensionEnum } from '../enums/media-extension.enum';
import { MediaMimeTypeEnum } from '../enums/media-mime-type.enum';
import { MediaStorageTypeEnum } from '../enums/media-storage-type.enum';
import { MediaUsageEnum } from '../enums/media-usage.enum';

@Injectable()
export class MediaService {
  constructor(
    @Inject(MediaRepository)
    private readonly mediaRepository: MediaRepository,
  ) {}

  /**
   * Xoá Media (Bao gồm file vật lý và dữ liệu DB)
   */
  async deleteMedia(mediaCode: string): Promise<boolean> {
    const media = await this.mediaRepository.findOne({ mediaCode });
    if (!media) return false;

    // Xoá File Vật Lý
    try {
      // Chống Path Traversal: Chuẩn hóa và validate đường dẫn
      const normalizedPath = path.normalize(media.url).replace(/^(\.\.(\/|\\|$))+/, '');
      if (!normalizedPath.startsWith('uploads')) {
        return false;
      }
      const filePath = path.join(process.cwd(), normalizedPath);
      await fs.unlink(filePath);
    } catch {
      // Bỏ qua lỗi nếu file không tồn tại
    }

    // Xóa dữ liệu trong DB
    await this.mediaRepository.deleteOne({ mediaCode });
    return true;
  }

  /**
   * Xoá nhiều Media thông qua danh sách URL
   */
  async deleteManyByUrls(urls: string[]): Promise<void> {
    if (!urls || urls.length === 0) return;

    // Chỉ xử lý các URL nội bộ (bắt đầu bằng /uploads)
    // Chống Path Traversal: Normalize và Filter gắt gao
    const localUrls = urls
      .map(url => path.normalize(url).replace(/^(\.\.(\/|\\|$))+/, ''))
      .filter(
        url =>
          url.startsWith('\\uploads') || url.startsWith('/uploads') || url.startsWith('uploads'),
      );

    for (let url of localUrls) {
      try {
        // Đảm bảo url không thoát khỏi thư mục uploads
        if (url.startsWith('/') || url.startsWith('\\')) {
          url = url.substring(1);
        }
        const filePath = path.join(process.cwd(), url);
        await fs.unlink(filePath);
      } catch {
        // Bỏ qua lỗi
      }
    }

    // Xóa dữ liệu trong DB
    await this.mediaRepository.deleteMany({ url: { $in: localUrls } });
  }

  /**
   * Xử lý lưu metadata cho 1 file upload
   */
  async handleSingleUpload(
    metadata: FileMetadata,
    usage: MediaUsageEnum,
  ): Promise<{ message: string; data: any; errorCode: null }> {
    const createdMedia = await this.mediaRepository.create({
      originalName: metadata.originName,
      slug: metadata.slug,
      mediaCode: metadata.mediaCode,
      url: metadata.url,
      mimeType: metadata.mimeType as MediaMimeTypeEnum,
      type: metadata.type as 'image' | 'video',
      extension: metadata.extension as MediaExtensionEnum,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      size: metadata.size,
      usage,
      storageType: MediaStorageTypeEnum.LOCAL,
      isActive: true,
      isDeleted: false,
      deletedAt: null,
    });

    return {
      message: 'Upload thành công',
      data: createdMedia,
      errorCode: null,
    };
  }

  /**
   * Xử lý lưu metadata cho nhiều file upload
   */
  async handleMultiUpload(
    metadataList: FileMetadata[],
    usage: MediaUsageEnum,
  ): Promise<{ message: string; data: any[]; errorCode: null }> {
    const createPayloads = metadataList.map(metadata => ({
      originalName: metadata.originName,
      slug: metadata.slug,
      mediaCode: metadata.mediaCode,
      url: metadata.url,
      mimeType: metadata.mimeType as MediaMimeTypeEnum,
      type: metadata.type as 'image' | 'video',
      extension: metadata.extension as MediaExtensionEnum,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      size: metadata.size,
      usage,
      storageType: MediaStorageTypeEnum.LOCAL,
      isActive: true,
      isDeleted: false,
      deletedAt: null,
    }));

    const createdMedias = await this.mediaRepository.insertMany(createPayloads);

    return {
      message: 'Upload nhiều file thành công',
      data: createdMedias,
      errorCode: null,
    };
  }

  /**
   * Tìm Media theo mã Code
   */
  async getByMediaCode(mediaCode: string) {
    return this.mediaRepository.findOne({ mediaCode });
  }

  /**
   * Tìm Media theo URL
   */
  async getByUrl(url: string) {
    return this.mediaRepository.findOne({ url });
  }

  /**
   * Xóa cứng Media theo mã (chỉ xóa DB, không xóa file)
   * Lưu ý: Hàm này ít dùng, thường dùng deleteMedia để xóa sạch hơn.
   */
  async hardDeleteByMediaCode(mediaCode: string): Promise<void> {
    await this.mediaRepository.deleteOne({ mediaCode });
  }
}
