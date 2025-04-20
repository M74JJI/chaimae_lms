import { string, z } from "zod";

const nameRegex =
  /^(?!.*(\s{2}|['-]{2}))[A-Za-zÀ-ÿ]+([ \p{L}'-]+[A-Za-zÀ-ÿ])?$/u;

export const CourseCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Course name must be at least 2 characters long." })
    .max(50, { message: "Course name cannot exceed 50 characters." })
    .regex(nameRegex, {
      message:
        "Course name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    }),
  categoryId: z
    .string({
      required_error: "Course category ID is mandatory.",
      invalid_type_error: "Course category ID must be a valid CUID.",
    })
    .cuid2(),
  slug: z.string().optional(),
});
export const CourseTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Course name must be at least 2 characters long." })
    .max(50, { message: "Course name cannot exceed 50 characters." })
    .regex(nameRegex, {
      message:
        "Course name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    }),
});
export const CourseCategorySchema = z.object({
  categoryId: z
    .string({
      required_error: "Course category is mandatory.",
      invalid_type_error: "Course category must be valid.",
    })
    .cuid2(),
});

export const CourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "Course name must be at least 2 characters long." })
    .max(50, { message: "Course name cannot exceed 50 characters." })
    .regex(nameRegex, {
      message:
        "Course name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    })
    .optional(),
  subtitle: z
    .string()
    .trim()
    .min(2, { message: "Course subtitle must be at least 2 characters long." })
    .max(100, { message: "Course subtitle cannot exceed 100 characters." })
    .regex(nameRegex, {
      message:
        "Course subtitle must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
    })
    .optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  thumbnail: z.string().optional(),
  promotionalVideo: z.string().optional(),
  status: z.string().default("DRAFT").optional(),
  difficultyLevel: z.string().default("BEGINNER").optional(),
  intendedLearners: z.string().array().optional(),
  prerequisites: z.string().array().optional(),
  objectives: z.string().array().optional(),
  categoryId: z
    .string({
      required_error: "Course category ID is mandatory.",
      invalid_type_error: "Course category ID must be a valid CUID.",
    })
    .cuid2()
    .optional(),
  subcategoryId: z
    .string({
      required_error: "Course sub-category ID is mandatory.",
      invalid_type_error: "Course sub-category ID must be a valid CUID.",
    })
    .cuid2()
    .optional(),
  languageId: z
    .string({
      required_error: "Course language ID is mandatory.",
      invalid_type_error: "Course language ID must be a valid CUID.",
    })
    .cuid2()
    .optional(),
  sections: z.any().optional(),
  deletedSections: z.object({ id: z.string() }).array().optional(),
  deletedLectures: z.object({ id: z.string() }).array().optional(),
});

export const CourseIntendedLearnersSchema = z.object({
  intendedLearners: z.string().array(),
});
export type CourseCreateSchemaType = z.infer<typeof CourseCreateSchema>;
export type CourseSchemaType = z.infer<typeof CourseSchema>;
