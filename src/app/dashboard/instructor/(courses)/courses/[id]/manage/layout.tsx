import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { course_dashboard_links } from "@/data/navigation-links";
import { db } from "@/lib/db";
import CourseHeader from "@/modules/admin/course/components/header/Header";
import { DashboardSidebar } from "@/modules/admin/course/components/sidebar/sidebar";
import { CourseTabsStatus } from "@/modules/admin/course/types";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CourseManageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/");
  const { id } = await params;
  const courseData = await db.course.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          sections: {
            where: {
              lectures: {},
            },
          },
        },
      },
    },
  });
  if (!courseData) redirect("/dashboard/instructor/courses");
  const {
    difficultyLevel,
    categoryId,
    subcategoryId,
    objectives,
    prerequisites,
    languageId,
    price,
    intendedLearners,
    subtitle,
    thumbnail,
    title,
    promotionalVideo,
    description,
  } = courseData;
  const course_statuses: CourseTabsStatus = {
    status: courseData.status,
    intendedLearners: courseData?.intendedLearners.length > 2,
    objectives: objectives.length > 2,
    prerequisites: prerequisites.length > 2,
    curriculum: courseData?._count.sections > 0,
    landing:
      difficultyLevel && categoryId && subcategoryId && languageId && price
        ? price >= 0
        : false &&
          intendedLearners.length > 0 &&
          subtitle &&
          thumbnail &&
          title &&
          promotionalVideo &&
          description,
  };
  return (
    <SidebarProvider className="flex flex-col h-[100vh]">
      <CourseHeader
        title={courseData.title}
        status={courseData.status}
        duration={courseData.duration}
      />
      <DashboardSidebar
        user={user}
        links={course_dashboard_links}
        title="Manage your course"
        course_statuses={course_statuses}
      />
      <SidebarInset>
        <div className="mt-1 flex flex-1">
          <div className="flex-1 p-4">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
