import { Metadata } from "next";
import { db } from "@/lib/db";
import CourseObjectivesForm from "@/modules/admin/course/components/forms/objectives";
import { CourseSectionType } from "@/modules/admin/course/types";
import CourseCurriculumForm from "@/modules/admin/course/components/forms/curriculum";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "Manage course curriculum",
};

export default async function ManageCurriculumCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data: CourseSectionType[] = await db.section.findMany({
    where: { courseId: id },
    include: {
      lectures: {
        include: {
          exerciseLecture: true,
          quizLecture: {
            include: {
              questions: true,
            },
          },
          videoLecture: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div>
      <CourseCurriculumForm courseId={id} data={data} />
    </div>
  );
}
