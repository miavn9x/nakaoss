export interface CategoryDetail {
  lang: string;
  name: string;
  slug: string;
}

export interface Category {
  code: string;
  parentCode: string | null;
  order: number;
  isActive: boolean;
  details: CategoryDetail[];
  createdAt?: string;
  updatedAt?: string;
  children?: Category[]; // For Tree View
}

export interface CreateCategoryRequest {
  code?: string;
  parentCode?: string | null;
  order?: number;
  isActive?: boolean;
  details: CategoryDetail[];
  children?: CreateCategoryRequest[]; // For Bulk/Recursive creation
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}
