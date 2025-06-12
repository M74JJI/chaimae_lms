import { Metadata } from "next";
import { db } from "@/lib/db";
import CourseObjectivesForm from "@/modules/admin/course/components/forms/objectives";
import CourseLandingForm from "@/modules/admin/course/components/forms/landing";

export const metadata: Metadata = {
  title: "Landing",
  description: "Manage course landing",
};

export default async function ManageLandingCourse({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await db.course.findUnique({
    where: { id },
    select: {
      title: true,
      subtitle: true,
      description: true,
      languageId: true,
      categoryId: true,
      subcategoryId: true,
      difficultyLevel: true,
      thumbnail: true,
      promotionalVideo: true,
    },
  });
  if (!data) return null;
  const languages = await db.language.findMany();
  const categories = await db.category.findMany();
  const subcategories = await db.subcategory.findMany({
    where: {
      categoryId: data.categoryId,
    },
  });
  const landingData = {
    title: data.title,
    subtitle: data.subtitle ?? undefined,
    description: data.description ?? undefined,
    languageId: data.languageId ?? undefined,
    categoryId: data.categoryId,
    subcategoryId: data.subcategoryId ?? undefined,
    difficultyLevel: data.difficultyLevel ?? undefined,
    thumbnail: data.thumbnail ?? undefined,
    promotionalVideo: data.promotionalVideo ?? undefined,
  };
  return (
    <div>
      <CourseLandingForm
        courseId={id}
        data={landingData}
        languages={languages}
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
