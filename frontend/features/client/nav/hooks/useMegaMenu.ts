import { useState, useEffect } from "react";
import { menuService, Category } from "../services/menu.service";

export const useMegaMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await menuService.getCategoryTree();
        const activeData = data.filter((c) => c.isActive !== false);
        setCategories(activeData);
      } catch (err) {
        // console.error("MegaMenu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading };
};
