"use server";
import { db } from "@/lib/db";

export async function deleteInstructorAction(id: string) {
  try {
    const result = await db.user.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

export const getAllInstructorsAction = async () => {
  const instructors = await db.user.findMany({
    where: {
      instructorProfile: {
        isNot: null,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return instructors;
};
