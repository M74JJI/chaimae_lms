import { Metadata } from "next";
import { db } from "@/lib/db";
import CourseIntendedLearnersForm from "@/modules/admin/course/components/forms/intended-learners";

export const metadata: Metadata = {
  title: "Intended learners",
  description: "Manage course intended learners",
};

export default async function ManageIntentedLearnersCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      intendedLearners: true,
    },
  });
  return (
    <div>
      <CourseIntendedLearnersForm
        courseId={id}
        data={data?.intendedLearners || []}
      />
    </div>
  );
}
