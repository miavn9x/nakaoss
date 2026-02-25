import { categoryService } from "@/features/client/category/services/category.service";
import { Category } from "@/features/client/category/types/category.types";

let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

type FlatCategory = {
  parentCode: string | null;
  slugs: Record<string, string>;
  names: Record<string, string>;
};

let flatCategories: Record<string, FlatCategory> = {};

let refreshPromise: Promise<void> | null = null;

export const getCategoryPath = async (
  code: string,
  lang: string,
): Promise<string[]> => {
  await ensureCategoryMap();
  return resolvePathForCode(code, lang);
};

export const getCategoryName = async (
  code: string,
  lang: string,
): Promise<string> => {
  await ensureCategoryMap();
  const cat: FlatCategory | undefined = flatCategories[code];
  if (!cat) return code;
  return cat.names[lang] || cat.names["vi"] || code;
};

async function ensureCategoryMap() {
  if (
    Date.now() - lastFetchTime > CACHE_TTL ||
    Object.keys(flatCategories).length === 0
  ) {
    if (!refreshPromise) {
      refreshPromise = refreshCategoryMap();
    }
    await refreshPromise;
  }
}

async function refreshCategoryMap() {
  try {
    // Synchronized: Use centralized categoryService which uses fetchClient (ISR 1 hour)
    const tree: Category[] = await categoryService.getTreeFull();

    if (!tree || tree.length === 0) return; // Silent fail if empty
    // const json = await res.json(); // Managed by fetchClient
    // const tree: Category[] = json.data || []; // Managed by fetchClient

    flatCategories = {};
    const processNode = (node: Category, parentCode: string | null) => {
      const slugs: Record<string, string> = {};
      const names: Record<string, string> = {};
      node.details.forEach((d) => {
        slugs[d.lang] = d.slug;
        names[d.lang] = d.name;
      });
      flatCategories[node.code] = { parentCode, slugs, names };
      node.children?.forEach((child) => processNode(child, node.code));
    };

    tree.forEach((node) => processNode(node, null));
    lastFetchTime = Date.now();
  } catch (error) {
    console.error("Error refreshing category map:", error);
  } finally {
    refreshPromise = null;
  }
}

export const getCategoryCodeByPath = async (
  path: string[],
): Promise<string | null> => {
  await ensureCategoryMap();
  if (path.length === 0) return null;

  const lastSlug = path[path.length - 1];

  // Tìm tất cả các category có slug này (vì slug có thể trùng ở các cấp khác nhau)
  const matches = Object.entries(flatCategories).filter(([code, cat]) => {
    return Object.values(cat.slugs).includes(lastSlug);
  });

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0][0];

  // Nếu có nhiều match (trùng slug ở các nhánh khác nhau), kiểm tra toàn bộ path
  for (const [code, cat] of matches) {
    const fullPath = resolvePathForCode(code, "vi"); // Dùng 'vi' làm chuẩn để check
    const slugsOnly = fullPath;

    // So khớp slug-to-slug (không phân biệt locale ở đây vì path URL đã fixed)
    // Thực tế URL có thể là slug của locale EN, NHƯNG resolvePathForCode trả về slug theo locale truyền vào.
    // Tốt nhất là check xem path truyền vào có khớp với BẤT KỲ locale path nào của node này không.
    // Tuy nhiên đơn giản nhất là check ngược lên parent.
    let isMatch = true;
    let currentPathCode: string | null = code;

    for (let i = path.length - 1; i >= 0; i--) {
      if (!currentPathCode || !flatCategories[currentPathCode]) {
        isMatch = false;
        break;
      }
      const c: FlatCategory = flatCategories[currentPathCode];
      if (!Object.values(c.slugs).includes(path[i])) {
        isMatch = false;
        break;
      }
      currentPathCode = c.parentCode;
    }

    if (isMatch && currentPathCode === null) return code;
  }

  return matches[0][0]; // Fallback match đầu tiên
};

function resolvePathForCode(code: string, lang: string): string[] {
  const path: string[] = [];
  let currentCode: string | null = code;

  while (currentCode && flatCategories[currentCode]) {
    const cat: FlatCategory = flatCategories[currentCode];
    const slug =
      cat.slugs[lang] ||
      cat.slugs["vi"] ||
      currentCode.toLowerCase().replace(/_/g, "-");
    path.unshift(slug);
    currentCode = cat.parentCode;
  }

  return path.length > 0 ? path : [code.toLowerCase().replace(/_/g, "-")];
}
