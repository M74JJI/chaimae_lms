"use server";
import { ErrorCode, FormResponse } from "@/types";
import { CategorySchema, CategorySchemaType } from "../schemas";
import { CategoryService } from "../services/category.service";
import { Category } from "@prisma/client";
import { ApiResponse } from "@/types/common";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";

// Create upsertCategory action
export async function upsertCategoryAction(
  data: Category
): Promise<FormResponse> {
  // Validate incoming data with Zod
  const validate = await CategorySchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      code: ErrorCode.VALIDATION_ERROR,
      message: validate.error.errors[0].message,
    };
  }

  // Proceed with upserting the category
  try {
    const result = await CategoryService.upsertCategory(data);
    // revalidatePath("/dashboard/admin/categories");
    return {
      success: true,
      message: "Category upserted successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch categories",
    };
  }
}

// Create deleteCategory action
export async function deleteCategoryAction(id: string) {
  try {
    const result = await CategoryService.deleteCategory(id);
    //   revalidatePath("/dashboard/admin/categories");
    return result;
  } catch (error) {
    return error;
  }
}

// Get categories action
export async function getCategoriesAction(): Promise<ApiResponse<Category[]>> {
  try {
    const categories = await CategoryService.getCategories();

    return {
      success: true,
      message: "",
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch categories",
      data: [],
    };
  }
}

// Get category by ID action
export async function getCategoryByIdAction(id: string) {
  try {
    const category = await CategoryService.getCategoryById(id);
    return {
      success: true,
      data: category,
    };
  } catch (error) {
    return error;
  }
}

export const getAllCategories = async () => {
  // Retrieve all categories from the database
  const categories = await db.category.findMany({
    include: {
      subcategories: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};
