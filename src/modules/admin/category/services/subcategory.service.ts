import { db } from "@/lib/db";
import { ErrorCode } from "@/types";
import { Subcategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export class SubcategoryService {
  // Get all subcategories
  static async getSubcategories() {
    try {
      const subcategories = await db.subcategory.findMany({
        include: {
          category: true,
        },
      });
      return subcategories;
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to fetch subcategories",
      };
    }
  }
  static async getSubcategoriesInCategory(categoryId: string) {
    try {
      const subcategories = await db.subcategory.findMany({
        where: {
          categoryId,
        },
      });
      return subcategories;
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to fetch subcategories",
      };
    }
  }

  // Get subcategory by ID
  static async getSubcategoryById(id: string) {
    try {
      const subcategory = await db.subcategory.findUnique({
        where: { id },
      });

      if (!subcategory) {
        throw {
          success: false,
          code: ErrorCode.DB_ERROR,
          message: "Subcategory not found",
        };
      }

      return subcategory;
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to fetch subcategory",
      };
    }
  }

  // Upsert subcategory (insert or update)
  static async upsertSubcategory(data: Subcategory) {
    try {
      const subcategory = await db.subcategory.upsert({
        where: { id: data.id ?? "" },
        update: data,
        create: data,
      });
      return subcategory;
    } catch (error: any) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: error.message,
      };
    }
  }

  // Delete subcategory
  static async deleteSubcategory(id: string) {
    try {
      await db.subcategory.delete({
        where: { id },
      });

      return {
        success: true,
        message: "Subcategory deleted successfully",
      };
    } catch (error) {
      throw {
        success: false,
        code: ErrorCode.DB_ERROR,
        message: "Failed to delete subcategory",
      };
    }
  }
}
