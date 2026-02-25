// --- Thư Viện NestJS ---
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

// --- Import Nội Bộ ---
import { UploadErrorCode } from 'src/common/enums/upload-error-code.enum';
import { ExtendedMulterFile } from 'src/common/interfaces/upload.interface';
import { generateFileMetadata } from 'src/common/utils/upload.util';
import { multerConfig } from 'src/configs/multer.config';
import { MediaUsageEnum } from 'src/modules/media/enums/media-usage.enum';
import { MediaService } from 'src/modules/media/services/media.service';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Upload một file đơn lẻ
   * Bao gồm kiểm tra metadata và lưu db
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: ExtendedMulterFile, @Body('usage') usage: MediaUsageEnum) {
    // Kiểm tra Usage hợp lệ
    if (!Object.values(MediaUsageEnum).includes(usage)) {
      throw new BadRequestException({
        message: 'Usage không hợp lệ',
        data: null,
        errorCode: UploadErrorCode.FILE_REQUIRED,
      });
    }

    // Kiểm tra Metadata từ Multer (được bind từ config)
    const multerFile = file as ExtendedMulterFile & {
      customUploadInfo: {
        slug: string;
        extension: string;
        absolutePath: string;
      };
    };

    if (!multerFile?.customUploadInfo) {
      throw new BadRequestException({
        message: 'Thiếu thông tin upload tạm thời',
        data: null,
        errorCode: UploadErrorCode.FILE_REQUIRED,
      });
    }

    // Tạo Metadata và gọi service
    const { slug, extension, absolutePath } = multerFile.customUploadInfo;
    const metadata = generateFileMetadata(multerFile, slug, extension, absolutePath);
    multerFile.metadata = metadata;

    const result = await this.mediaService.handleSingleUpload(multerFile.metadata, usage);
    return result;
  }

  /**
   * Upload nhiều file cùng lúc (Tối đa 10 file)
   */
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadMultipleFiles(
    @UploadedFiles() files: ExtendedMulterFile[],
    @Body('usage') usage: MediaUsageEnum,
  ) {
    if (!Object.values(MediaUsageEnum).includes(usage)) {
      throw new BadRequestException({
        message: 'Usage không hợp lệ',
        data: null,
        errorCode: UploadErrorCode.FILE_REQUIRED,
      });
    }

    // Mapping Metadata cho các file
    const metadataList = files.map(file => {
      const multerFile = file as ExtendedMulterFile & {
        customUploadInfo: {
          slug: string;
          extension: string;
          absolutePath: string;
        };
      };

      if (!multerFile?.customUploadInfo) {
        throw new BadRequestException({
          message: 'Thiếu thông tin upload tạm thời',
          data: null,
          errorCode: UploadErrorCode.FILE_REQUIRED,
        });
      }

      const { slug, extension, absolutePath } = multerFile.customUploadInfo;
      const metadata = generateFileMetadata(multerFile, slug, extension, absolutePath);
      multerFile.metadata = metadata;
      return metadata;
    });

    // Gọi Service xử lý hàng loạt
    const result = await this.mediaService.handleMultiUpload(metadataList, usage);
    return result;
  }

  /**
   * Xóa media hoàn toàn (File + DB) theo Media Code
   */
  @Delete(':mediaCode/hard-delete')
  async hardDeleteMedia(@Param('mediaCode') mediaCode: string) {
    const media = await this.mediaService.getByMediaCode(mediaCode);
    if (!media) {
      throw new BadRequestException({
        message: 'Media không tồn tại',
        data: null,
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    await this.mediaService.deleteMedia(mediaCode);

    return {
      message: 'Xoá media thành công',
      data: null,
      errorCode: null,
    };
  }

  /**
   * Xóa media hoàn toàn theo URL
   */
  @Delete('by-url')
  async hardDeleteMediaByUrl(@Body('url') urlPath: string) {
    if (!urlPath) {
      throw new BadRequestException({
        message: 'URL không được để trống',
        data: null,
        errorCode: 'URL_REQUIRED',
      });
    }

    const media = await this.mediaService.getByUrl(urlPath);

    if (!media) {
      throw new BadRequestException({
        message: 'Media không tồn tại',
        data: null,
        errorCode: 'MEDIA_NOT_FOUND',
      });
    }

    await this.mediaService.deleteMedia(media.mediaCode);

    return {
      message: 'Xoá media thành công',
      data: null,
      errorCode: null,
    };
  }
}
