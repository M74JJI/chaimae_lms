"use server";
import { ErrorCode, FormResponse } from "@/types";
import { Subcategory } from "@prisma/client";
import { ApiResponse } from "@/types/common";
import { revalidatePath, revalidateTag } from "next/cache";
import { SubcategorySchema } from "../schemas/subcategory.schema";
import { SubcategoryService } from "../services/subcategory.service";
import { SubCategoryWithCategory } from "../types";

// Create upsertSubcategory action
export async function upsertSubcategoryAction(
  data: Subcategory
): Promise<FormResponse> {
  const validate = await SubcategorySchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      code: ErrorCode.VALIDATION_ERROR,
      message: validate.error.errors[0].message,
    };
  }

  try {
    const result = await SubcategoryService.upsertSubcategory(data, {
      name: "SubcategoryService.upsertSubcategory",
    });
    // revalidatePath("/dashboard/admin/subcategories");
    return {
      success: true,
      message: "Subcategory upserted successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to upsert subcategory",
    };
  }
}

// Create deleteSubcategory action
export async function deleteSubcategoryAction(id: string) {
  try {
    const result = await SubcategoryService.deleteSubcategory(id, {
      name: "SubcategoryService.deleteSubcategory",
    });
    // revalidatePath("/dashboard/admin/subcategories");
    return result;
  } catch (error) {
    return error;
  }
}

// Get all subcategories action
export async function getSubcategoriesAction(): Promise<
  ApiResponse<SubCategoryWithCategory[]>
> {
  try {
    const subcategories = await SubcategoryService.getSubcategories({
      name: "SubcategoryService.getSubcategories",
    });

    return {
      success: true,
      message: "",
      data: subcategories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch subcategories",
      data: [],
    };
  }
}
export async function getSubcategoriesInCategoryAction(
  categoryId: string
): Promise<ApiResponse<Subcategory[]>> {
  try {
    const subcategories = await SubcategoryService.getSubcategoriesInCategory(
      categoryId,
      {
        name: "SubcategoryService.getSubcategories",
      }
    );

    return {
      success: true,
      message: "",
      data: subcategories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch subcategories",
      data: [],
    };
  }
}

// Get subcategory by ID action
export async function getSubcategoryByIdAction(id: string) {
  try {
    const subcategory = await SubcategoryService.getSubcategoryById(id, {
      name: "SubcategoryService.getSubcategoryById",
    });
    return {
      success: true,
      data: subcategory,
    };
  } catch (error) {
    return error;
  }
}
