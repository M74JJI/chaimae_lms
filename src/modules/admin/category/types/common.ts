import { Prisma } from "@prisma/client";
import { SubcategoryService } from "../services/subcategory.service";

export type SubCategoryWithCategory = Prisma.PromiseReturnType<
  typeof SubcategoryService.getSubcategories
>[0];
