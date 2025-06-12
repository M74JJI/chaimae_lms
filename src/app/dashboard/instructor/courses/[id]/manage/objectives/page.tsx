import { Metadata } from "next";
import { db } from "@/lib/db";
import CourseObjectivesForm from "@/modules/admin/course/components/forms/objectives";

export const metadata: Metadata = {
  title: "Objectives",
  description: "Manage course objectives",
};

export default async function ManageObjectivesCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      objectives: true,
    },
  });
  return (
    <div>
      <CourseObjectivesForm courseId={id} data={data?.objectives || []} />
    </div>
  );
}
