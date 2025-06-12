import { db } from "@/lib/db";
import CoursePricingForm from "@/modules/admin/course/components/forms/pricing";

export default async function ManagePricingCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      price: true,
    },
  });
  if (!data) return null;
  return (
    <div>
      <CoursePricingForm courseId={id} price={data.price || 0} />
    </div>
  );
}
