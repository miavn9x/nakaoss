import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto, CategoryDetailDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Post, PostDocument } from '../../post/schemas/post.schema';
import { slugify } from 'src/common/utils/slugify.util';
import pinyin from 'pinyin';
import { INVALID_NAME_CHARS_LIST } from 'src/common/constants/validation.constant';
import { RevalidationService } from '../../revalidation/services/revalidation.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    private readonly revalidationService: RevalidationService,
  ) {}

  // --- Helper: Generate Unique Suffix ---
  private generateSuffix(type: 'HEX' | 'DIGIT', length: number): string {
    if (type === 'HEX') {
      return Math.floor(Math.random() * Math.pow(16, length))
        .toString(16)
        .toUpperCase()
        .padStart(length, '0');
    }
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  // --- Helper: Generate Unique Code recursively ---
  private async ensureUniqueCode(parentCode: string | null, depth: number): Promise<string> {
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      if (depth === 0) {
        // Cấp 1: CAT-XXXXXX (Hex)
        code = `CAT-${this.generateSuffix('HEX', 6)}`;
      } else if (depth === 1) {
        // Cấp 2: PARENT-XXXXXX (Hex)
        code = `${parentCode}-${this.generateSuffix('HEX', 6)}`;
      } else {
        // Cấp 3: PARENT-XXXXXX (Digit)
        code = `${parentCode}-${this.generateSuffix('DIGIT', 6)}`;
      }

      // Kiểm tra sự tồn tại ở bất kỳ cấp độ nào trong DB
      const exists = await this.categoryModel.exists({
        $or: [
          { code: code }, // Level 1
          { 'children.code': code }, // Level 2
          { 'children.children.code': code }, // Level 3
        ],
      });

      if (!exists) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new BadRequestException('Không thể sinh mã duy nhất cho danh mục. Thử lại sau.');
    }

    return code;
  }

  // --- Helper: Generate Slugs ---
  private generateSlugs(details: CategoryDetailDto[], fallbackCode: string) {
    const enDetail = details.find(d => d.lang === 'en');

    details.forEach(detail => {
      // 100% Backend sinh slug - bỏ qua dữ liệu từ FE nếu có
      const sourceText = detail.name || '';

      if (detail.lang === 'zh' || detail.lang === 'cn') {
        // Tiếng Trung: Pinyin -> Slug
        const pinyinTitle = pinyin(sourceText, {
          style: 0, // STYLE_NORMAL is 0
        })
          .flat()
          .join(' ');
        detail.slug = slugify(pinyinTitle);
      } else if (detail.lang === 'bo') {
        // Tiếng Phạn/Bodhi: Fallback về EN -> Code
        if (enDetail && enDetail.name) {
          detail.slug = slugify(enDetail.name);
        } else {
          detail.slug = fallbackCode.toLowerCase();
        }
      } else {
        // VN / EN: Slugify title
        detail.slug = slugify(sourceText);
      }

      // Fallback cuối cùng nếu mọi thứ rỗng
      if (!detail.slug || detail.slug.trim() === '') {
        detail.slug = fallbackCode.toLowerCase();
      }
    });
    return details;
  }

  private validateNames(details: CategoryDetailDto[]) {
    details.forEach(detail => {
      if (!detail.name || detail.name.trim() === '') return;

      // Check blacklist characters
      for (const char of detail.name) {
        if (INVALID_NAME_CHARS_LIST.includes(char)) {
          throw new BadRequestException(`Tên danh mục (${detail.lang}) chứa ký tự không hợp lệ.`);
        }
      }
    });
  }

  // 1. Create (Nested Structure)
  async create(dto: CreateCategoryDto) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        // Clone DTO to avoid side effects on retry
        const createDto = JSON.parse(JSON.stringify(dto)) as CreateCategoryDto;

        // 1. Tự động sinh mã cho Root nếu chưa có
        if (!createDto.code) {
          createDto.code = await this.ensureUniqueCode(null, 0);
        } else {
          const exists = await this.categoryModel.exists({ code: createDto.code });
          if (exists) {
            throw new BadRequestException(`Category code ${createDto.code} already exists`);
          }
        }

        // 2. Xử lý đệ quy cho toàn bộ cây (Sinh mã, sinh slug, validate)
        await this.processRecursive(createDto, undefined, 0);

        // 3. CHỈ LƯU CẤP 1
        if (createDto.parentCode) {
          throw new BadRequestException(
            'Chỉ được tạo danh mục Cấp 1 trực tiếp. Children phải embed trong field children[]',
          );
        }

        // 4. Validation: Max 8 Children Level 2
        if (createDto.children && createDto.children.length > 8) {
          throw new BadRequestException('MAX_CHILDREN_LEVEL_2');
        }

        const created = new this.categoryModel(createDto);
        const saved = await created.save();
        // Trigger Revalidation
        await this.revalidationService.revalidate('categories');
        return saved;
      } catch (error) {
        attempts++;
        const err = error as { code?: number };
        // Nếu là lỗi trùng mã duy nhất (Race condition trigger: E11000)
        if (err.code === 11000 && attempts < maxAttempts) {
          console.warn(`Race condition detected on create (attempt ${attempts}), retrying...`);
          // Xóa code ở DTO gốc để vòng lặp sau sinh mã mới
          dto.code = undefined;
          continue;
        }
        throw error;
      }
    }
  }

  // Helper: Đệ quy xử lý dữ liệu (Mã, Slug, Validation)
  private async processRecursive(
    dto: CreateCategoryDto,
    parentCode: string | undefined,
    depth: number,
  ) {
    // A. Đảm bảo có mã code
    if (!dto.code) {
      dto.code = await this.ensureUniqueCode(parentCode || null, depth);
    }

    // B. Đảm bảo parentCode đúng
    dto.parentCode = parentCode;

    // C. Validate & Generate slugs cho details (100% Backend)
    if (dto.details) {
      const emptyDetails = dto.details.filter(d => !d.name || d.name.trim() === '');
      if (emptyDetails.length > 0) {
        throw new BadRequestException('MISSING_LANG_NAMES');
      }
      this.validateNames(dto.details);
      this.generateSlugs(dto.details, dto.code);
    }

    // D. Đệ quy cho con
    if (dto.children && dto.children.length > 0) {
      if (depth >= 2) {
        throw new BadRequestException('MAX_LEVEL_EXCEEDED');
      }
      if (dto.children.length > 8) {
        throw new BadRequestException('MAX_CHILDREN_EXCEEDED');
      }

      for (const child of dto.children) {
        await this.processRecursive(child, dto.code, depth + 1);
      }
    }
  }

  // 2. Update (Nested Structure)
  async update(code: string, dto: UpdateCategoryDto) {
    // Tìm document Root chứa mã code này (có thể là mã của node con)
    const existing = await this.categoryModel
      .findOne({
        $or: [{ code: code }, { 'children.code': code }, { 'children.children.code': code }],
      })
      .exec();

    if (!existing) throw new NotFoundException('CATEGORY_NOT_FOUND');

    // Chèn dữ liệu mới vào existing (Cảnh báo: DTO gửi lên phải là cấu trúc của toàn bộ Root)
    // frontend/features/admin/.../EditCategory.tsx đã đảm bảo gửi nguyên Root payload
    const fullDto = { ...existing.toObject(), ...dto };

    // Tự động sinh mã/slug cho các node mới hoặc thay đổi tên (100% BE)
    await this.processRecursive(fullDto as CreateCategoryDto, undefined, 0);

    const updated = await this.categoryModel
      .findOneAndUpdate({ code: existing.code }, fullDto, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('CATEGORY_NOT_FOUND');

    // Trigger Revalidation
    await this.revalidationService.revalidate('categories');

    return updated;
  }

  // 3. Find One
  async findOne(code: string) {
    const item = await this.categoryModel
      .findOne({
        $or: [
          { code: code }, // Level 1
          { 'children.code': code }, // Level 2
          { 'children.children.code': code }, // Level 3
        ],
      })
      .exec();

    if (!item) throw new NotFoundException('Category not found');
    return item;
  }

  // Find by Slug (Hỗ trợ SEO bài viết)
  async findBySlug(slug: string) {
    return this.categoryModel
      .findOne({
        $or: [
          { 'details.slug': slug },
          { 'children.details.slug': slug },
          { 'children.children.details.slug': slug },
        ],
      })
      .lean()
      .exec();
  }

  // 4. Delete (Kiểm tra xem có bài viết không)
  async delete(code: string) {
    // 1. Kiểm tra xem có bài viết nào đang trỏ đến danh mục này không
    // Cần kiểm tra cả các danh mục con nếu xóa Root
    const relatedPosts = await this.postModel.findOne({ category: code }).exec();
    if (relatedPosts) {
      throw new BadRequestException('CATEGORY_HAS_POSTS');
    }

    // 2. Tìm document Cấp 1 chứa code này
    const root = await this.categoryModel
      .findOne({
        $or: [{ code: code }, { 'children.code': code }, { 'children.children.code': code }],
      })
      .exec();

    if (!root) throw new NotFoundException('CATEGORY_NOT_FOUND');

    // 3. Nếu là Root, xóa toàn bộ
    if (root.code === code) {
      // Trước khi xóa Root, check xem các con của nó có bài viết không
      const allCodes = this.getAllCodes(root);
      const postInAny = await this.postModel.findOne({ category: { $in: allCodes } }).exec();
      if (postInAny) {
        throw new BadRequestException('CATEGORY_HAS_POSTS');
      }
      const deleted = await this.categoryModel.findOneAndDelete({ code }).exec();
      // Trigger Revalidation
      await this.revalidationService.revalidate('categories');
      return deleted;
    }

    // 4. Nếu ở Cấp 2 hoặc 3, thực hiện xóa khỏi mảng
    // Cần kiểm tra post cho chính cái node sắp xóa này
    const deletedNode = this.findInTree(root, code);
    if (deletedNode) {
      const subCodes = this.getAllCodes(deletedNode);
      const postInSub = await this.postModel.findOne({ category: { $in: subCodes } }).exec();
      if (postInSub) {
        throw new BadRequestException('CATEGORY_HAS_POSTS');
      }
    }

    const updated = this.removeFromChildren(root, code);
    if (updated) {
      await this.categoryModel
        .findOneAndUpdate({ code: root.code }, { children: root.children }, { new: true })
        .exec();
      // Trigger Revalidation
      await this.revalidationService.revalidate('categories');
      return { message: 'Deleted successfully', code };
    }

    throw new NotFoundException('CATEGORY_NOT_FOUND');
  }

  // Helper: Lấy toàn bộ mã code trong cây con (Public for PostService)
  public getAllCodes(cat: Category): string[] {
    let codes = [cat.code];
    if (cat.children) {
      cat.children.forEach(child => {
        codes = [...codes, ...this.getAllCodes(child)];
      });
    }
    return codes;
  }

  // Helper: Tìm node trong cây (Public for PostService)
  public findInTree(parent: Category, code: string): Category | null {
    if (parent.code === code) return parent;
    if (parent.children) {
      for (const child of parent.children) {
        const found = this.findInTree(child, code);
        if (found) return found;
      }
    }
    return null;
  }

  // Helper: Đệ quy tìm và xóa category khỏi children array
  private removeFromChildren(parent: Category, codeToDelete: string): boolean {
    if (!parent.children || parent.children.length === 0) {
      return false;
    }

    const index = parent.children.findIndex((child: Category) => child.code === codeToDelete);

    if (index !== -1) {
      parent.children.splice(index, 1);
      return true;
    }

    for (const child of parent.children) {
      if (this.removeFromChildren(child, codeToDelete)) {
        return true;
      }
    }

    return false;
  }

  // 5. Build Tree (Paginated Root Categories)
  async getTree(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.categoryModel.countDocuments({ parentCode: null }).exec(),
      this.categoryModel
        .find({ parentCode: null })
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  // 5b. Get Full Tree (Non-paginated - for Select/Menu)
  async getTreeFull() {
    const items = await this.categoryModel
      .find({ parentCode: null })
      .sort({ order: 1 })
      .lean()
      .exec();

    return items;
  }

  // 6. Get All Flat (Dùng cho Admin để tra cứu nhanh)
  async findAll() {
    const roots = await this.categoryModel.find().sort({ order: 1, createdAt: -1 }).lean().exec();

    const flatList: Category[] = [];
    const flatten = (items: Category[]) => {
      items.forEach(item => {
        const { children, ...rest } = item;
        flatList.push(rest as Category);
        if (children && children.length > 0) {
          flatten(children);
        }
      });
    };

    flatten(roots);
    return flatList;
  }
}
