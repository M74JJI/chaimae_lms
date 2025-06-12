"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveLectureProgress({
  userId,
  courseId,
  lectureId,
  progress,
  completed,
}: {
  userId: string;
  courseId: string;
  lectureId: string;
  progress: number;
  completed: boolean;
}) {
  try {
    const result = await db.userLectureProgress.upsert({
      where: {
        userId_lectureId: {
          userId,
          lectureId,
        },
      },
      update: {
        progress,
        completed: completed || progress >= 100,
        updatedAt: new Date(),
      },
      create: {
        user: { connect: { id: userId } },
        lecture: { connect: { id: lectureId } },
        course: { connect: { id: courseId } },
        progress,
        completed: completed || progress >= 100,
      },
      include: {
        lecture: true,
      },
    });

    // Also update course completion status if needed
    if (completed || progress >= 100) {
      await updateCourseCompletionStatus(userId, courseId);
    }

    revalidatePath(`/course/[slug]/learn/[sectionId]/[lectureId]`, "page");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save lecture progress:", error);
    throw new Error("Failed to save lecture progress");
  }
}

export async function saveQuizProgress({
  userId,
  courseId,
  lectureId,
  score,
  answers,
  completed,
}: {
  userId: string;
  courseId: string;
  lectureId: string;
  score: number;
  answers: { questionId: string; answerIndex: number; isCorrect: boolean }[];
  completed: boolean;
}) {
  try {
    const result = await db.userQuizProgress.upsert({
      where: {
        userId_lectureId: {
          userId,
          lectureId,
        },
      },
      update: {
        score,
        answers,
        completed,
        updatedAt: new Date(),
      },
      create: {
        user: { connect: { id: userId } },
        lecture: { connect: { id: lectureId } },
        course: { connect: { id: courseId } },
        score,
        answers,
        completed,
      },
      include: {
        lecture: true,
      },
    });

    // Update course completion status if quiz is completed
    if (completed) {
      await updateCourseCompletionStatus(userId, courseId);
    }

    revalidatePath(`/course/[slug]/learn/[sectionId]/[lectureId]`, "page");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
    throw new Error("Failed to save quiz progress");
  }
}

async function updateCourseCompletionStatus(userId: string, courseId: string) {
  // Check if all lectures are completed
  const totalLectures = await db.lecture.count({
    where: {
      section: {
        courseId,
      },
    },
  });

  const completedLectures = await db.userLectureProgress.count({
    where: {
      userId,
      courseId,
      completed: true,
    },
  });

  // Update user course relation if all lectures are completed
  if (totalLectures > 0 && completedLectures >= totalLectures) {
    await db.userCourse.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });
  }
}
