import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Book, Clock, Settings } from "lucide-react";
import { CourseCard } from "@/modules/home/components/course-card";

export default async function ProfilePage() {
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
      {/* Sidebar Navigation */}
      <div className="hidden md:block w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-50 bg-gray-200 dark:bg-gray-800 transition-colors"
          >
            <Icons.user className="h-5 w-5" />
            Profile Information
          </Link>
          <Link
            href="/profile/courses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
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
          className="flex flex-col items-center p-2 text-sm"
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
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Profile Information
          </h1>

          <div className="grid gap-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={user.email}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user.firstName}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user.lastName || ""}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="image">Profile Picture</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={user.image || "/default-avatar.jpg"}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </div>

            {/* Stats Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<Book className="h-6 w-6" />}
                  title="Courses"
                  value={user.ownedCourses.length.toString()}
                />
                {/*
                <StatCard
                  icon={<Icons.star className="h-6 w-6" />}
                  title="Reviews"
                  value={user.reviews.length.toString()}
                />
               */}
                <StatCard
                  icon={<Clock className="h-6 w-6" />}
                  title="Hours Learned"
                  value="42"
                />
                <StatCard
                  icon={<Icons.badge className="h-6 w-6" />}
                  title="Certificates"
                  value="3"
                />
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recently Viewed</h2>
                <Link
                  href="/profile/courses"
                  className="text-sm text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              {user.ownedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.ownedCourses.slice(0, 2).map(({ course }) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven't enrolled in any courses yet
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-white dark:bg-gray-800">{icon}</div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="font-bold text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}
