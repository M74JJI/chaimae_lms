import { auth } from "@/auth";
import { CoreService, ServiceContext } from "@/lib/core-service";
import { db } from "@/lib/db";
import { ErrorCode } from "@/types";
import { Category, Course, Lecture, Section } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  CourseCreateSchemaType,
  CourseSchemaType,
} from "../schemas/course.schema";
import slugify from "slugify";

export class CourseService extends CoreService {
  // Get all categories

  // Get category by ID

  // Upsert category (insert or update)
  static async upsertCourse(data: Course, context: ServiceContext) {
    return this.execute(
      async () => {
        try {
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
          const new_data = { ...data, instructorProfileId: instr?.id };

          const course = await db.course.upsert({
            where: { id: data.id ?? "" }, // Use nullish coalescing for clarity
            update: new_data,
            create: new_data,
          });
          return course;
        } catch (error: any) {
          throw {
            success: false,
            code: ErrorCode.DB_ERROR,
            message: error.message,
          };
        }
      },
      { ...context }
    );
  }

  static async createCourse(
    data: CourseCreateSchemaType,
    context: ServiceContext
  ) {
    return this.execute(
      async () => {
        try {
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
          // Only generate slug on create
          let baseSlug = slugify(data.title, { lower: true, strict: true });
          let uniqueSlug = baseSlug;
          let counter = 1;

          // Check for slug uniqueness
          while (await CourseService.slugExists(uniqueSlug)) {
            uniqueSlug = `${baseSlug}-${counter++}`;
          }
          const new_data = {
            ...data,
            instructorProfileId: instr?.id,
            slug: uniqueSlug,
          };

          const course = await db.course.create({
            data: {
              ...new_data,
              sections: {
                create: {
                  title: "Introduction",
                  order: 0,
                  lectures: {
                    create: {
                      title: "Introduction",
                      order: 0,
                      type: "VIDEO",
                    },
                  },
                },
              },
            },
          });
          return course;
        } catch (error: any) {
          console.log(error);

          throw {
            success: false,
            code: ErrorCode.DB_ERROR,
            message: error.message,
          };
        }
      },
      { ...context }
    );
  }

  static async updateCourse(
    courseId: string,
    updatedFields: CourseSchemaType,
    context: ServiceContext
  ) {
    return this.execute(
      async () => {
        try {
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
              message: "Instructor profile not found.",
            };
          }

          // First check if the course exists and belongs to the instructor
          const existingCourse = await db.course.findFirst({
            where: {
              id: courseId,
              instructorProfileId: instr.id,
            },
          });

          if (!existingCourse) {
            throw {
              success: false,
              code: ErrorCode.DB_ERROR,
              message: "Course not found or unauthorized.",
            };
          }

          let { sections, deletedSections, deletedLectures, ...rest } =
            updatedFields;

          const sanitizedData = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== undefined)
          );
          if (deletedSections && deletedSections.length > 0) {
            await db.section.deleteMany({
              where: {
                id: { in: deletedSections.map((section) => section.id) },
              },
            });
          }
          if (deletedLectures && deletedLectures.length > 0) {
            await db.lecture.deleteMany({
              where: {
                id: { in: deletedLectures.map((lecture) => lecture.id) },
              },
            });
          }
          if (sections) {
            console.log(sections.map((s) => s.lectures));
            await db.course.update({
              where: { id: courseId },
              data: {
                sections: {
                  upsert: sections.map((section) => ({
                    where: { id: section.id || "none" },
                    update: {
                      title: section.title,
                      description: section.description,
                      order: section.order,
                      lectures: {
                        upsert: section.lectures?.map((lecture) => ({
                          where: { id: lecture.id || "none" },
                          update: {
                            title: lecture.title,
                            description: lecture.description,
                            order: lecture.order,
                            type: lecture.type,
                            ...(lecture.videoLecture && {
                              videoLecture: {
                                upsert: {
                                  where: { lectureId: lecture.id || "none" },
                                  update: {
                                    videoUrl: lecture.videoLecture.videoUrl,
                                    videoName: lecture.videoLecture.videoName,
                                    duration: lecture.videoLecture.duration,
                                    subtitles: lecture.videoLecture.subtitles,
                                  },
                                  create: {
                                    videoUrl: lecture.videoLecture.videoUrl,
                                    videoName: lecture.videoLecture.videoName,
                                    duration: lecture.videoLecture.duration,
                                    subtitles: lecture.videoLecture.subtitles,
                                  },
                                },
                              },
                            }),
                            ...(lecture.quizLecture && {
                              quizLecture: {
                                upsert: {
                                  where: { lectureId: lecture.id || "none" },
                                  update: {
                                    passingScore:
                                      lecture.quizLecture.passingScore,
                                    questions: {
                                      deleteMany: {},
                                      create:
                                        lecture.quizLecture.questions?.map(
                                          (q) => ({
                                            question: q.question,
                                            options: q.options,
                                            correctIndex: q.correctIndex,
                                            explanation: q.explanation,
                                          })
                                        ),
                                    },
                                  },
                                  create: {
                                    passingScore:
                                      lecture.quizLecture.passingScore,
                                    questions: {
                                      create:
                                        lecture.quizLecture.questions?.map(
                                          (q) => ({
                                            question: q.question,
                                            options: q.options,
                                            correctIndex: q.correctIndex,
                                            explanation: q.explanation,
                                          })
                                        ),
                                    },
                                  },
                                },
                              },
                            }),
                          },
                          create: {
                            title: lecture.title,
                            description: lecture.description,
                            order: lecture.order,
                            type: lecture.type,
                            ...(lecture.videoLecture && {
                              videoLecture: {
                                create: {
                                  videoUrl: lecture.videoLecture.videoUrl,
                                  videoName: lecture.videoLecture.videoName,
                                  duration: lecture.videoLecture.duration,
                                  subtitles: lecture.videoLecture.subtitles,
                                },
                              },
                            }),
                            ...(lecture.quizLecture && {
                              quizLecture: {
                                create: {
                                  passingScore:
                                    lecture.quizLecture.passingScore,
                                  questions: {
                                    create: lecture.quizLecture.questions?.map(
                                      (q) => ({
                                        question: q.question,
                                        options: q.options,
                                        correctIndex: q.correctIndex,
                                        explanation: q.explanation,
                                      })
                                    ),
                                  },
                                },
                              },
                            }),
                          },
                        })),
                      },
                    },
                    create: {
                      title: section.title,
                      description: section.description,
                      order: section.order,
                      lectures: {
                        create: section.lectures?.map((lecture) => ({
                          title: lecture.title,
                          description: lecture.description,
                          order: lecture.order,
                          type: lecture.type,
                          ...(lecture.videoLecture && {
                            videoLecture: {
                              create: {
                                videoUrl: lecture.videoLecture.videoUrl,
                                videoName: lecture.videoLecture.videoName,
                                duration: lecture.videoLecture.duration,
                                subtitles: lecture.videoLecture.subtitles,
                              },
                            },
                          }),
                          ...(lecture.quizLecture && {
                            quizLecture: {
                              create: {
                                passingScore: lecture.quizLecture.passingScore,
                                questions: {
                                  create: lecture.quizLecture.questions?.map(
                                    (q) => ({
                                      question: q.question,
                                      options: q.options,
                                      correctIndex: q.correctIndex,
                                      explanation: q.explanation,
                                    })
                                  ),
                                },
                              },
                            },
                          }),
                        })),
                      },
                    },
                  })),
                },
              },
            });
          }

          const course = await db.course.update({
            where: { id: courseId },
            data: sanitizedData, // ✅ Now it's Prisma-compatible
          });

          return course;
        } catch (error: any) {
          throw {
            success: false,
            code: ErrorCode.DB_ERROR,
            message: error.message || "Failed to update course properties.",
          };
        }
      },
      { ...context }
    );
  }

  static async slugExists(slug: string): Promise<boolean> {
    return (
      (await db.course.findFirst({
        where: { slug },
        select: { id: true },
      })) !== null
    );
  }
}
