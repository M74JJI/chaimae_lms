import { CoreService, ServiceContext } from "@/lib/core-service";
import { db } from "@/lib/db";
import { ErrorCode } from "@/types";
import { Subcategory } from "@prisma/client";
import { revalidatePath } from "next/cache";

export class SubcategoryService extends CoreService {
  // Get all subcategories
  static async getSubcategories(context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }
  static async getSubcategoriesInCategory(
    categoryId: string,
    context: ServiceContext
  ) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Get subcategory by ID
  static async getSubcategoryById(id: string, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Upsert subcategory (insert or update)
  static async upsertSubcategory(data: Subcategory, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }

  // Delete subcategory
  static async deleteSubcategory(id: string, context: ServiceContext) {
    return this.execute(
      async () => {
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
      },
      { ...context }
    );
  }
}
