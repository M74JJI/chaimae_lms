import { db } from "@/lib/db";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Search, User, Youtube } from "lucide-react";
import Header from "@/components/layout/header/header";

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchQuery = searchParams.search
    ? typeof searchParams.search === "string"
      ? searchParams.search
      : searchParams.search[0]
    : undefined;

  const instructors = await db.instructorProfile.findMany({
    where: {
      user: {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      courses: {
        select: {
          id: true,
        },
      },
      socialLinks: true,
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return (
    <>
      <Header />
      <div className="bg-background pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Meet Our Instructors
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Learn from industry experts and passionate educators
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search instructors by name..."
                defaultValue={searchQuery}
                className="pl-10 pr-4 py-6 text-lg rounded-xl shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Instructors Grid */}
          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/instructors/${instructor.id}`}>
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mb-4">
                          <Image
                            src={instructor.user.image || "/default-avatar.jpg"}
                            alt={instructor.user.name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {instructor.user.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                            {instructor.courses.length} Courses
                          </Badge>
                        </div>
                        {instructor.bio && (
                          <p className="text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">
                            {instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Social Links */}
                  {instructor.socialLinks && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-4">
                      {instructor.socialLinks.linkedin && (
                        <a
                          href={instructor.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Icons.linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {instructor.socialLinks.github && (
                        <a
                          href={instructor.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Icons.github className="h-5 w-5" />
                        </a>
                      )}
                      {instructor.socialLinks.youtube && (
                        <a
                          href={instructor.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No instructors found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? `No instructors match your search for "${searchQuery}"`
                  : "There are currently no instructors available"}
              </p>
            </div>
          )}
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
