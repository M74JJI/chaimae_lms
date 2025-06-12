import { Metadata } from "next";
import { db } from "@/lib/db";
import CoursePrerequisitesForm from "@/modules/admin/course/components/forms/prerequisites";

export const metadata: Metadata = {
  title: "Prerequisites",
  description: "Manage course prerequisites",
};

export default async function ManagePrerequisitesCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      prerequisites: true,
    },
  });
  return (
    <div>
      <CoursePrerequisitesForm courseId={id} data={data?.prerequisites || []} />
    </div>
  );
}
