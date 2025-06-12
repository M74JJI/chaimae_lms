// app/profile/courses/page.tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Book, BookCopy, Settings } from "lucide-react";
import { CourseCard } from "@/modules/home/components/course-card";

export default async function ProfileCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedCourses: {
        include: {
          course: {
            include: {
              category: true,
              reviews: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      },
      instructorProfile: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:block w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Icons.user className="h-5 w-5" />
            Profile Information
          </Link>
          <Link
            href="/profile/courses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-800 transition-colors"
          >
            <Book className="h-5 w-5" />
            My Courses
          </Link>
          {user.instructorProfile && (
            <Link
              href={`/instructor/${user.instructorProfile.id}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Icons.badge className="h-5 w-5" />
              Instructor Profile
            </Link>
          )}
          <Separator className="my-2" />
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="h-5 w-5" />
            Account Settings
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t flex justify-around p-2">
        <Link
          href="/profile"
          className="flex flex-col items-center p-2 text-sm"
        >
          <Icons.user className="h-5 w-5" />
          <span>Profile</span>
        </Link>
        <Link
          href="/profile/courses"
          className="flex flex-col items-center p-2 text-sm text-primary"
        >
          <Book className="h-5 w-5" />
          <span>Courses</span>
        </Link>
        {user.instructorProfile && (
          <Link
            href={`/instructor/${user.instructorProfile.id}`}
            className="flex flex-col items-center p-2 text-sm"
          >
            <Icons.badge className="h-5 w-5" />
            <span>Instructor</span>
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              My Courses
            </h1>
            <Button asChild>
              <Link href="/courses">Browse More Courses</Link>
            </Button>
          </div>

          {user.ownedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.ownedCourses.map(({ course }) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showProgress
                  actionButton={
                    <Button asChild size="sm" className="mt-2">
                      <Link href={`/course/${course.slug}`}>
                        {course.completed ? "Review" : "Continue"}
                      </Link>
                    </Button>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <BookCopy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No courses enrolled yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                Get started by browsing our course catalog
              </p>
              <Button asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
