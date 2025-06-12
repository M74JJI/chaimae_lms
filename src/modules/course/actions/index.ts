"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ErrorCode } from "@/types";

export type SortOrder = "asc" | "desc";

export const getCourses = async (
  filters: any = {},
  sortBy = "",
  page: number = 1,
  pageSize: number = 10
) => {
  // Default values for page and pageSize
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  // Construct the base query
  const wherClause: any = {
    AND: [],
  };

  // Exclude product if sent
  if (filters.courseId) {
    wherClause.AND.push({
      id: {
        not: filters.courseId,
      },
    });
  }

  // Apply category filter (using category URL)
  if (filters.category) {
    const category = await db.category.findUnique({
      where: {
        url: filters.category,
      },
      select: { id: true },
    });
    if (category) {
      wherClause.AND.push({ categoryId: category.id });
    }
  }

  // Apply subCategory filter (using subCategory URL)
  if (filters.subCategory) {
    const subCategory = await db.subcategory.findUnique({
      where: {
        url: filters.subCategory,
      },
      select: { id: true },
    });
    if (subCategory) {
      wherClause.AND.push({ subcategoryId: subCategory.id });
    }
  }

  // Apply search filter (search term in product name or description)
  if (filters.search) {
    wherClause.AND.push({
      OR: [
        {
          title: { contains: filters.search },
        },
        {
          description: { contains: filters.search },
        },
        {
          subtitle: { contains: filters.search },
        },
      ],
    });
  }

  // Apply price filters (min and max price)
  if (filters.minPrice || filters.maxPrice) {
    wherClause.AND.push({
      price: {
        gte: filters.minPrice || 0, // Default to 0 if no min price is set
        lte: filters.maxPrice || Infinity, // Default to Infinity if no max price is set
      },
    });
  }

  // Define the sort order
  let orderBy: Record<string, SortOrder> = {};
  switch (sortBy) {
    case "most-popular":
      orderBy = { createdAt: "desc" };
      break;
    case "new-arrivals":
      orderBy = { createdAt: "desc" };
      break;
    case "top-rated":
      orderBy = { rating: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  {
    /*
    wherClause.AND.push({
    status: "PUBLISHED",
  });
  */
  }

  const courses = await db.course.findMany({
    where: wherClause,
    orderBy,
    take: limit, // Limit to page size
    skip: skip, // Skip the products of previous pages
    include: {
      sections: true,
      category: true,
      language: true,
      subcategory: true,
      instructorProfile: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  // Product price sorting
  courses.sort((a, b) => {
    // Explicitly check for price sorting conditions
    if (a.price && b.price) {
      if (sortBy === "price-low-to-high") {
        return a.price - b.price; // Ascending order
      } else if (sortBy === "price-high-to-low") {
        return b.price - a.price; // Descending order
      }
    }

    // If no price sort option is provided, return 0 (no sorting by price)
    return 0;
  });

  const new_courses = courses.map((course) => {
    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category.name,
      subcategory: course.subcategory?.name,
      difficultyLevel: course.difficultyLevel,
      duration: course.duration,
      language: course.language?.name || "English",
      numLectures: course.numLectures,
      rating: course.rating,
      numReviews: course.numReviews,
      instructor_name: course.instructorProfile.user.name,
      instructor_image: course.instructorProfile.user.image,
      price: course.price,
      slug: course.slug,
      numSections: course.sections.length,
    };
  });

  /*
  const totalCount = await db.product.count({
    where: wherClause,
  });
  */

  const totalCount = courses.length;

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Return the paginated data along with metadata
  return {
    courses: new_courses,
    totalPages,
    currentPage,
    pageSize,
    totalCount,
  };
};

export const getAllCoursesForInstructorAction = async () => {
  const session = await auth();
  const instr = await db.instructorProfile.findFirst({
    where: {
      userId: session?.user.id,
    },
  });
  if (!instr) {
    throw {
      success: false,
      code: ErrorCode.DB_ERROR,
      message: "Smth went wrong",
    };
  }
  const courses = await db.course.findMany({
    where: {
      instructorProfile: {
        id: instr.id,
      },
    },
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

export const submitCourseForReview = async (course_id: string) => {
  const session = await auth();
  const instr = await db.instructorProfile.findFirst({
    where: {
      userId: session?.user.id,
    },
  });
  if (!instr) {
    throw {
      success: false,
      code: ErrorCode.DB_ERROR,
      message: "Smth went wrong",
    };
  }
  const course = await db.course.findUnique({
    where: {
      id: course_id,
    },
  });
  if (course?.status === "SUBMITTED") return;
  const updatedCourse = await db.course.update({
    where: {
      id: course_id,
    },
    data: {
      status: "SUBMITTED",
    },
  });
  return updatedCourse;
};
