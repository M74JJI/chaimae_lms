import { db } from "@/lib/db";
import { ErrorCode } from "@/types";
import { Category } from "@prisma/client";

export class CategoryService {
  // Get all categories
  static async getCategories() {
    try {
      const categories = await db.category.findMany();
      return categories;
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to fetch categories",
      };
    }
  }

  // Get category by ID
  static async getCategoryById(id: string) {
    try {
      const category = await db.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw {
          success: false,
          code: ErrorCode.DB_ERROR,
          message: "Category not found",
        };
      }

      return category;
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to fetch category",
      };
    }
  }

  // Upsert category (insert or update)
  static async upsertCategory(data: Category) {
    try {
      const category = await db.category.upsert({
        where: { id: data.id ?? "" }, // Use nullish coalescing for clarity
        update: data,
        create: data,
      });
      return category;
    } catch (error: any) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: error.message,
      };
    }
  }

  // Delete category
  static async deleteCategory(id: string) {
    try {
      await db.category.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to delete category",
      };
    }
  }
}
