import { z } from "zod";

const nameRegex =
  /^(?!.*(\s{2}|['-]{2}))[A-Za-zÀ-ÿ]+([ \p{L}'-]+[A-Za-zÀ-ÿ])?$/u;

export const CategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name cannot exceed 50 characters." })
    .regex(nameRegex, {
      message:
        "Category name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    }),
  url: z.string(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
