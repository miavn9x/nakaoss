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
  children?: Category[]; // Nested structure from tree-full API
  createdAt?: string;
  updatedAt?: string;
}
