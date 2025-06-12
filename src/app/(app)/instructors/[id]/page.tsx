import { db } from "@/lib/db";
import { Icons } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Book, Globe, User, Youtube } from "lucide-react";
import { CourseCard } from "@/modules/home/components/course-card";
import Header from "@/components/layout/header/header";

export default async function InstructorPage({
  params,
}: {
  params: { id: string };
}) {
  const instructor = await db.instructorProfile.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      socialLinks: true,
      courses: {
        include: {
          category: true,
          language: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!instructor) {
    return notFound();
  }

  // Calculate average rating and number of students
  const totalCourses = instructor.courses.length;
  const totalReviews = instructor.courses.reduce(
    (sum, course) => sum + course.reviews.length,
    0
  );
  const avgRating =
    instructor.courses.reduce(
      (sum, course) =>
        sum + course.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    ) / (totalReviews || 1);

  const totalStudents = instructor.courses.reduce(
    (sum, course) => sum + course.numReviews,
    0
  );

  return (
    <>
      <Header />
      <div className="bg-background pt-16">
        <div className="container mx-auto px-4 py-12">
          {/* Instructor Hero Section */}
          <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 p-8 rounded-3xl shadow-xl mb-12 border border-white/20 dark:border-gray-700/30">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <Image
                  src={instructor.user.image || "/default-avatar.jpg"}
                  alt={instructor.user.name}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  {instructor.user.name}
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                  {instructor.bio || "Professional Instructor"}
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  <Badge className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200">
                    <Book className="h-4 w-4 mr-1" />
                    {totalCourses} Courses
                  </Badge>
                  <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                    <User className="h-4 w-4 mr-1" />
                    {totalStudents.toLocaleString()} Students
                  </Badge>
                  <Badge className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                    <Icons.star className="h-4 w-4 mr-1" />
                    {avgRating.toFixed(1)} Instructor Rating
                  </Badge>
                </div>

                {instructor.socialLinks && (
                  <div className="flex gap-4 mt-6">
                    {instructor.socialLinks.website && (
                      <a
                        href={instructor.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Globe className="h-6 w-6" />
                      </a>
                    )}
                    {instructor.socialLinks.linkedin && (
                      <a
                        href={instructor.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Icons.linkedin className="h-6 w-6" />
                      </a>
                    )}
                    {instructor.socialLinks.github && (
                      <a
                        href={instructor.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Icons.github className="h-6 w-6" />
                      </a>
                    )}
                    {instructor.socialLinks.youtube && (
                      <a
                        href={instructor.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Youtube className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          {instructor.bio && (
            <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-12">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                About Me
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p>{instructor.bio}</p>
              </div>
            </section>
          )}

          {/* Courses Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                My Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {totalCourses} {totalCourses === 1 ? "course" : "courses"} total
              </p>
            </div>

            {instructor.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructor.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No courses published yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Check back later for new courses from this instructor
                </p>
              </div>
            )}
          </section>

          {/* Stats Section */}
          <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Instructor Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<Icons.star className="h-8 w-8 text-amber-500" />}
                title="Average Rating"
                value={avgRating.toFixed(1)}
                description={`From ${totalReviews} reviews`}
              />
              <StatCard
                icon={<User className="h-8 w-8 text-blue-500" />}
                title="Total Students"
                value={totalStudents.toLocaleString()}
                description="Across all courses"
              />
              <StatCard
                icon={<Book className="h-8 w-8 text-purple-500" />}
                title="Courses Created"
                value={totalCourses.toString()}
                description="Published on our platform"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
