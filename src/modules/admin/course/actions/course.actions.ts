"use server";
import { ErrorCode, FormResponse } from "@/types";
import { Course } from "@prisma/client";
import {
  CourseSchema,
  CourseCreateSchema,
  CourseCreateSchemaType,
  CourseSchemaType,
} from "../schemas/course.schema";
import { CourseService } from "../services/course.service";
import slugify from "slugify";
import { ApiResponse } from "@/types/common";
import { db } from "@/lib/db";
// Create upsertCourseAction action
export async function upsertCourseAction(data: Course): Promise<FormResponse> {
  // Validate incoming data with Zod
  const validate = await CourseSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      code: ErrorCode.VALIDATION_ERROR,
      message: validate.error.errors[0].message,
    };
  }

  try {
    // Only generate slug on create
    let baseSlug = slugify(data.title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for slug uniqueness
    while (await CourseService.slugExists(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }
    data.slug = uniqueSlug;

    const result = await CourseService.upsertCourse(data);

    return {
      success: true,
      message: "Course upserted successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to upsert course",
    };
  }
}
export async function createCourseAction(
  data: CourseCreateSchemaType
): Promise<ApiResponse<Course | null>> {
  // Validate incoming data with Zod
  const validate = await CourseCreateSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      message: validate.error.errors[0].message,
      data: null,
    };
  }

  try {
    const result = await CourseService.createCourse(data);

    return {
      success: true,
      message: "Course upserted successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to upsert course",
      data: null,
    };
  }
}
export async function updateCourseAction(
  courseId: string,
  data: CourseSchemaType
): Promise<ApiResponse<Course | null>> {
  // Validate incoming data with Zod
  const validate = await CourseSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      success: false,
      message: validate.error.errors[0].message,
      data: null,
    };
  }

  try {
    const result = await CourseService.updateCourse(courseId, data);

    return {
      success: true,
      message: "Course updated successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update course",
      data: null,
    };
  }
}

export const getAllCoursesForAdminAction = async () => {
  // Retrieve all courses from the database
  const courses = await db.course.findMany({
    include: {
      category: true,
      subcategory: true,
      _count: {
        select: {
          sections: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return courses;
};

export async function deletecourseAction(id: string) {
  try {
    const result = await db.course.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

export const getAllSubmittedCoursesAction = async () => {
  // Retrieve all submitted courses from the database
  const courses = await db.course.findMany({
    where: {
      status: "SUBMITTED",
    },
    include: {
      category: true,
      subcategory: true,
      language: true,
      instructorProfile: {
        include: {
          user: true,
        },
      },
      sections: {
        include: {
          lectures: {
            include: {
              exerciseLecture: true,
              quizLecture: true,
              videoLecture: true,
            },
          },
        },
      },
      _count: {
        select: {
          sections: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return courses;
};
