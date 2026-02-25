// --- Thư Viện NestJS & Mongoose ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';

// --- Import Nội Bộ ---
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { Post, PostDocument } from '../schemas/post.schema';
import { MediaService } from '../../media/services/media.service';
import { extractImageUrlsFromHtml } from 'src/common/utils/html.util';
import { User } from '../../users/schemas/user.schema';
import { slugify } from 'src/common/utils/slugify.util';
import pinyin from 'pinyin'; // Import Pinyin
import { CategoryService } from '../../Category/services/category.service';
import { RevalidationService } from '../../revalidation/services/revalidation.service';

// --- Service Bài Viết ---
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    private readonly mediaService: MediaService,
    private readonly categoryService: CategoryService,
    private readonly revalidationService: RevalidationService,
  ) {}

  // 1. Tạo Bài Viết (Sinh Mã Tự Động)
  async create(dto: CreatePostDto) {
    // Kiểm tra danh mục tồn tại
    if (dto.category) {
      await this.categoryService.findOne(dto.category);
    }

    const now = new Date();
    const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getFullYear().toString().slice(-2)}`;
    let code = '';
    let exist = true;

    // Vòng lặp tạo mã code duy nhất: POST + Ngày + Random
    while (exist) {
      const random = Math.floor(100000 + Math.random() * 900000);
      code = `POST${datePart}${random}`;
      const existed = await this.postModel.exists({ code }).exec();
      exist = !!existed;
    }

    // 2. Tự động tạo slug nếu chưa có
    if (dto.details) {
      // Find English detail for fallback
      const enDetail = dto.details.find(d => d.lang === 'en');

      dto.details.forEach(detail => {
        if (!detail.slug) {
          const sourceText = detail.title || '';

          if (detail.lang === 'zh') {
            // Tiếng Trung: Dùng Pinyin
            const pinyinTitle = pinyin(sourceText, {
              style: pinyin.STYLE_NORMAL, // "fó jiào" -> "fo jiao"
            })
              .flat()
              .join(' ');
            detail.slug = slugify(pinyinTitle);
          } else if (detail.lang === 'bo') {
            // Tiếng Tạng: Dùng Tiếng Anh -> Code
            if (enDetail && enDetail.title) {
              detail.slug = slugify(enDetail.title);
            } else {
              // Nếu không có tiếng Anh -> Dùng Code
              detail.slug = code.toLowerCase();
            }
          } else {
            // Tiếng Việt / Anh: Dùng title gốc
            detail.slug = slugify(sourceText);
          }

          // Fallback cuối cùng: Nếu slug vẫn rỗng (do không có title TA/TV cho Tạng, hoặc title rỗng) -> Dùng Code
          if (!detail.slug || detail.slug.trim() === '') {
            detail.slug = code.toLowerCase();
          }
        }
      });
    }

    const created = new this.postModel({ ...dto, code });
    const saved = await created.save();

    // Trigger Revalidation for the category (so the list updates)
    if (dto.category) {
      await this.revalidationService.revalidate('categories');
    }
    // Trigger Revalidation for posts list
    await this.revalidationService.revalidate('posts');

    return {
      message: 'CREATE_POST_SUCCESS',
      data: saved,
      errorCode: null,
    };
  }

  // 2. Cập Nhật Bài Viết
  async update(code: string, dto: UpdatePostDto) {
    // Kiểm tra danh mục tồn tại nếu có update
    if (dto.category) {
      await this.categoryService.findOne(dto.category);
    }

    const exists = await this.postModel.exists({ code }).exec();
    if (!exists) {
      throw new NotFoundException({
        message: 'POST_NOT_FOUND',
        errorCode: 'POST_NOT_FOUND',
      });
    }

    // Tự động cập nhật slug nếu có thay đổi details
    if (dto.details) {
      // Find English detail for fallback
      const enDetail = dto.details.find(d => d.lang === 'en');

      dto.details.forEach(detail => {
        if (!detail.slug) {
          // Chỉ tạo nếu slug rỗng
          const sourceText = detail.title || '';

          if (detail.lang === 'zh') {
            const pinyinTitle = pinyin(sourceText, {
              style: pinyin.STYLE_NORMAL,
            })
              .flat()
              .join(' ');
            detail.slug = slugify(pinyinTitle);
          } else if (detail.lang === 'bo') {
            if (enDetail && enDetail.title) {
              detail.slug = slugify(enDetail.title);
            } else {
              detail.slug = code.toLowerCase();
            }
          } else {
            detail.slug = slugify(sourceText);
          }

          if (!detail.slug || detail.slug.trim() === '') {
            detail.slug = code.toLowerCase();
          }
        }
      });
    }

    const updated = await this.postModel
      .findOneAndUpdate({ code }, dto, {
        new: true,
      })
      .exec();

    // Trigger Revalidation
    await this.revalidationService.revalidate('categories');
    await this.revalidationService.revalidate('posts');

    return {
      message: 'UPDATE_POST_SUCCESS',
      data: updated,
      errorCode: null,
    };
  }

  // 3. Lấy Danh Sách (Tìm Kiếm + Phân Trang + Bộ Lọc)
  async findAll(
    page: number,
    limit: number,
    search?: string,
    filters?: {
      category?: string;
      isFeatured?: boolean;
      isNew?: boolean;
      visibility?: string;
    },
  ) {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};

    // A. Tìm kiếm trong details (Title, Description, Content)
    if (search) {
      query['details'] = {
        $elemMatch: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ],
        },
      };
    }

    // B. Bộ lọc
    if (filters?.category) {
      // Tối ưu: Nếu là category cha, lấy luôn bài viết của các con
      const rootCategory = await this.categoryService.findOne(filters.category);
      if (rootCategory) {
        // Tìm đúng node đích trong cây (có thể là root hoặc con/cháu)
        const targetNode = this.categoryService.findInTree(rootCategory, filters.category);
        if (targetNode) {
          const subCodes = this.categoryService.getAllCodes(targetNode);
          query['category'] = { $in: subCodes };
        } else {
          query['category'] = filters.category;
        }
      } else {
        query['category'] = filters.category;
      }
    }
    if (filters?.isFeatured !== undefined) query['isFeatured'] = filters.isFeatured;
    if (filters?.isNew !== undefined) query['isNew'] = filters.isNew;
    if (filters?.visibility) query['visibility'] = filters.visibility;

    const [items, total] = await Promise.all([
      this.postModel
        .find(
          query,
          'code cover category isFeatured isNew visibility details.lang details.title details.description createdAt -_id',
        )
        .sort({ isNew: -1, createdAt: -1 }) // Ưu tiên tin mới, sau đó đến ngày tạo
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.postModel.countDocuments(query).exec(),
    ]);

    return {
      message: 'GET_POSTS_SUCCESS',
      data: {
        items, // Frontend tự lọc ngôn ngữ để hiển thị
        pagination: {
          total,
          page,
          limit,
        },
      },
      errorCode: null,
    };
  }

  // 4. Lấy Chi Tiết (Có kiểm tra quyền)
  async findOne(code: string, currentUser?: User) {
    const post = await this.postModel.findOne({ code }).lean().exec();
    if (!post) {
      throw new NotFoundException({
        message: 'POST_NOT_FOUND',
        errorCode: 'POST_NOT_FOUND',
      });
    }

    // Kiểm tra quyền truy cập
    if (post.visibility === 'MEMBERS_ONLY' && !currentUser) {
      throw new ForbiddenException('FORBIDDEN_MEMBERS_ONLY');
    }

    return {
      message: 'GET_POST_DETAIL_SUCCESS',
      data: post,
      errorCode: null,
    };
  }

  // 5. Xóa Bài Viết (Xóa cả ảnh liên quan)
  async delete(code: string) {
    const post = await this.postModel.findOne({ code }).exec();
    if (!post) {
      throw new NotFoundException({
        message: 'POST_NOT_FOUND',
        errorCode: 'POST_NOT_FOUND',
      });
    }

    // A. Xoá ảnh bìa
    if (post.cover && post.cover.mediaCode) {
      await this.mediaService.deleteMedia(post.cover.mediaCode);
    }

    // B. Xoá ảnh trong nội dung HTML (Quét tất cả ngôn ngữ)
    if (post.details && post.details.length > 0) {
      let allImageUrls: string[] = [];
      post.details.forEach(detail => {
        if (detail.content) {
          const urls = extractImageUrlsFromHtml(detail.content);
          allImageUrls = [...allImageUrls, ...urls];
        }
      });
      // Loại bỏ trùng lặp nếu có
      allImageUrls = [...new Set(allImageUrls)];

      if (allImageUrls.length > 0) {
        await this.mediaService.deleteManyByUrls(allImageUrls);
      }
    }

    const deleted = await this.postModel.findOneAndDelete({ code }).exec();

    // Trigger Revalidation
    await this.revalidationService.revalidate('categories');
    await this.revalidationService.revalidate('posts');

    return {
      message: 'DELETE_POST_SUCCESS',
      data: deleted,
      errorCode: null,
    };
  }

  // =================================================================================================
  //                                     CLIENT API (OPTIMIZED)
  // =================================================================================================

  // 6. CLIENT: Lấy Danh Sách (Tối ưu Projection)
  async findClientAll(
    page: number,
    limit: number,
    search?: string,
    filters?: {
      category?: string;
      isFeatured?: boolean;
      isNew?: boolean;
      visibility?: string;
    },
    currentUser?: User, // Add currentUser parameter
  ) {
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};

    if (filters?.visibility) {
      query['visibility'] = filters.visibility;
    } else {
      // Logic mặc định:
      // - Nếu chưa đăng nhập: Chỉ xem PUBLIC
      // - Nếu đã đăng nhập: Xem PUBLIC hoặc MEMBERS_ONLY
      if (currentUser) {
        query['visibility'] = { $in: ['PUBLIC', 'MEMBERS_ONLY'] };
      } else {
        query['visibility'] = 'PUBLIC';
      }
    }

    // A. Tìm kiếm
    if (search) {
      query['details'] = {
        $elemMatch: {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        },
      };
    }

    // B. Bộ lọc
    if (filters?.category) {
      // Tối ưu Client: Lấy bài viết của cả các danh mục con
      try {
        const rootCategory = await this.categoryService.findOne(filters.category);
        if (rootCategory) {
          // Tìm đúng node đích
          const targetNode = this.categoryService.findInTree(rootCategory, filters.category);
          if (targetNode) {
            const subCodes = this.categoryService.getAllCodes(targetNode);
            query['category'] = { $in: subCodes };
          } else {
            query['category'] = filters.category;
          }
        } else {
          query['category'] = filters.category;
        }
      } catch {
        // Fallback if category service fails or not found
        query['category'] = filters.category;
      }
    }
    if (filters?.isFeatured !== undefined) query['isFeatured'] = filters.isFeatured;
    if (filters?.isNew !== undefined) query['isNew'] = filters.isNew;
    // Client thường chỉ xem được PUBLIC, nếu muốn xem MEMBERS_ONLY thì phải có token (logic controller).
    // Ở đây mình để filter mở, Controller sẽ gán visibility nếu cần. Nhưng user ko yêu cầu filter visibility input, chỉ output.
    // Defaulting to exposing all unless filtered by controller? Let's genericise.

    // STRICT PROJECTION:
    // code, category, cover, isFeatured, isNew, visibility, createdAt
    // details: lang, title, description, slug
    const projection =
      'code category cover isFeatured isNew visibility createdAt details.lang details.title details.description details.slug -_id';

    const [items, total] = await Promise.all([
      this.postModel
        .find(query, projection)
        .sort({ isNew: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.postModel.countDocuments(query).exec(),
    ]);

    // Populate Category Details manually (cause Schema is Nested)
    // 1. Get all categories flat
    const allCategories = await this.categoryService.findAll();
    // 2. Create Map
    const categoryMap = new Map(allCategories.map(c => [c.code, c]));
    // 3. Attach
    const itemsWithCategory = items.map((item: Post) => {
      const cat = categoryMap.get(item.category);
      return {
        ...item,
        categoryDetail: cat
          ? {
              code: cat.code,
              details: cat.details,
            }
          : null,
      };
    });

    return {
      message: 'GET_POSTS_SUCCESS',
      data: {
        items: itemsWithCategory,
        pagination: { total, page, limit },
      },
      errorCode: null,
    };
  }

  // 7. CLIENT: Lấy Chi Tiết (Tối ưu Projection)
  async findClientOne(code: string, currentUser?: User) {
    // STRICT PROJECTION:
    // code, category, visibility, createdAt
    // details: lang, title, slug, description, content
    // NO cover, NO id, NO updatedAt
    const projection =
      'code category cover visibility createdAt details.lang details.title details.slug details.description details.content -_id';

    const post = await this.postModel.findOne({ code }, projection).lean().exec();

    if (!post) {
      return {
        message: 'POST_NOT_FOUND',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    // Kiểm tra quyền truy cập
    if (post.visibility === 'MEMBERS_ONLY' && !currentUser) {
      throw new ForbiddenException('FORBIDDEN_MEMBERS_ONLY');
    }

    return {
      message: 'GET_POST_DETAIL_SUCCESS',
      data: post,
      errorCode: null,
    };
  }
  // 8. CLIENT: Lấy Chi Tiết theo Slug (SEO)
  async findClientBySlug(categorySlug: string, slug: string, currentUser?: User) {
    // Strict Projection giống findClientOne
    const projection =
      'code category cover visibility createdAt details.lang details.title details.slug details.description details.content -_id';

    // 1. Tìm thông tin danh mục theo slug trước
    const category = await this.categoryService.findBySlug(categorySlug);
    if (!category) {
      return {
        message: 'CATEGORY_NOT_FOUND',
        data: null,
        errorCode: 'CATEGORY_NOT_FOUND',
      };
    }

    // 2. Lấy code của node cụ thể (vì findBySlug trả về root document chứa node đó)
    // Cần tìm trong cây của category xem node nào khớp slug
    let targetCategoryCode = '';

    // Use proper type for node traversal
    // We can import Category interface or define a minimal recursive type here
    interface CategoryNode {
      code: string;
      details?: { slug: string }[];
      children?: CategoryNode[];
    }

    const findCodeInDetails = (node: CategoryNode): boolean => {
      const hasSlug = node.details?.some(d => d.slug === categorySlug);
      if (hasSlug) {
        targetCategoryCode = node.code;
        return true;
      }
      return node.children?.some(child => findCodeInDetails(child)) ?? false;
    };

    // Cast category to unknown first if types don't perfectly align,
    // or better yet, ensure category is typed correctly from findBySlug
    findCodeInDetails(category as unknown as CategoryNode);

    if (!targetCategoryCode) {
      return {
        message: 'POST_NOT_FOUND_IN_CATEGORY',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    // 3. Tìm bài viết theo mã danh mục và slug bài viết
    const post = await this.postModel
      .findOne(
        {
          category: targetCategoryCode,
          'details.slug': slug,
        },
        projection,
      )
      .lean()
      .exec();

    if (!post) {
      return {
        message: 'POST_NOT_FOUND',
        data: null,
        errorCode: 'POST_NOT_FOUND',
      };
    }

    // Kiểm tra quyền truy cập
    if (post.visibility === 'MEMBERS_ONLY' && !currentUser) {
      throw new ForbiddenException('FORBIDDEN_MEMBERS_ONLY');
    }

    return {
      message: 'GET_POST_DETAIL_SUCCESS',
      data: post,
      errorCode: null,
    };
  }
}
