import Header from "@/components/layout/dashboard/header/Header";
import { db } from "@/lib/db";
import CourseDetails from "@/modules/admin/course/components/forms/course-details";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Course",
};

export default async function InstructorDashboardNewCoursePage() {
  const categories = await db.category.findMany();
  const languages = await db.language.findMany();
  return (
    <div className="bg-muted/50 ">
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <CourseDetails languages={languages} categories={categories} />
      </div>
    </div>
  );
}
