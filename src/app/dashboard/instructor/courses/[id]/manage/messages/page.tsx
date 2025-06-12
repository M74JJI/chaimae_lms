import { db } from "@/lib/db";
import CourseMessagesForm from "@/modules/admin/course/components/forms/messages";

export default async function ManageMessagesCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      welcomeMessage: true,
      congratulationsMessage: true,
    },
  });
  if (!data) return null;
  return (
    <div>
      <CourseMessagesForm courseId={id} data={data} />
    </div>
  );
}
