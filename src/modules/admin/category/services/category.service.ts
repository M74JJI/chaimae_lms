import { CoreService, ServiceContext } from "@/lib/core-service";
import { db } from "@/lib/db";
import { ErrorCode } from "@/types";
import { Category } from "@prisma/client";
import { CategorySchemaType } from "../schemas";
import { revalidatePath } from "next/cache";

export class CategoryService extends CoreService {
  // Get all categories
  static async getCategories(context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Get category by ID
  static async getCategoryById(id: string, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Upsert category (insert or update)
  static async upsertCategory(data: Category, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Delete category
  static async deleteCategory(id: string, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }
}
