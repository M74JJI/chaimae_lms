"use server";
import { db } from "@/lib/db";

export async function deleteStudentAction(id: string) {
  try {
    const result = await db.user.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    return error;
  }
}

export const getAllStudentsAction = async () => {
  const students = await db.user.findMany({
    where: {
      instructorProfile: null,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return students;
};
