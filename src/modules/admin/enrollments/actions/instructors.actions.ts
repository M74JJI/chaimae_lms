"use server";
import { db } from "@/lib/db";

export const getAllEnrollmentsAction = async () => {
  const enrollments = await db.userCourse.findMany({
    include: {
      user: true,
      course: true,
    },
    orderBy: {
      purchasedAt: "desc",
    },
  });

  return enrollments;
};
