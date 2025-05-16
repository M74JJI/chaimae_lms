import { Category, Prisma, Subcategory } from "@prisma/client";
import { SubcategoryService } from "../services/subcategory.service";

export type SubCategoryWithCategory = Prisma.PromiseReturnType<
  typeof SubcategoryService.getSubcategories
>[0];

export type CatgegoryWithSubsType = Category & {
  subcategories: Subcategory[];
};
