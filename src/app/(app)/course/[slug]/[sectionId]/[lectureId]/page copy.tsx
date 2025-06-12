import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { CoursePlayer } from "@/modules/course/components/course-player";
import { Quiz } from "@/modules/course/components/quiz";

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId?: string; lectureId?: string }>;
}) {
  const { slug, sectionId, lectureId } = await params;
  const currentUser = await auth();
  const user = currentUser?.user;

  console.log("--->", slug, sectionId, lectureId);

  // Fetch course data and verify enrollment
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      users: {
        where: {
          userId: user?.id,
        },
      },
      sections: {
        include: {
          lectures: {
            include: {
              videoLecture: true,
              quizLecture: {
                include: {
                  questions: true,
                },
              },
              exerciseLecture: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!course) redirect("/");
  if (course.users.length === 0) redirect(`/course/${slug}`);

  // Find current section and lecture
  const currentSection = sectionId
    ? course.sections.find((section) => section.id === sectionId)
    : course.sections[0];

  const currentLecture = lectureId
    ? currentSection?.lectures.find((lecture) => lecture.id === lectureId)
    : currentSection?.lectures[0];

  if (!currentSection || !currentLecture) redirect(`/course/${slug}`);

  // Calculate course progress
  const totalLectures = course.sections.reduce(
    (total, section) => total + section.lectures.length,
    0
  );
  const completedLectures = await db.userLectureProgress.count({
    where: {
      userId: user?.id,
      courseId: course.id,
      completed: true,
    },
  });
  const progressPercentage = Math.round(
    (completedLectures / totalLectures) * 100
  );

  // Find next lecture
  const currentSectionIndex = course.sections.findIndex(
    (section) => section.id === currentSection.id
  );
  const currentLectureIndex = currentSection.lectures.findIndex(
    (lecture) => lecture.id === currentLecture.id
  );

  let nextLecture = null;
  if (currentLectureIndex < currentSection.lectures.length - 1) {
    // Next lecture in same section
    nextLecture = currentSection.lectures[currentLectureIndex + 1];
  } else if (currentSectionIndex < course.sections.length - 1) {
    // First lecture of next section
    nextLecture = course.sections[currentSectionIndex + 1].lectures[0];
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Course Header */}
      <header className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/course/${slug}`} className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back to course</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-48">
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-center mt-1">
                {progressPercentage}% complete
              </div>
            </div>
            <Button variant="outline" size="sm">
              Help
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r hidden lg:block overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{course.title}</h2>
            <Progress value={progressPercentage} className="h-2 mb-4" />
          </div>

          <div className="space-y-2 px-2">
            {course.sections.map((section) => (
              <div key={section.id} className="space-y-1">
                <div
                  className={`px-3 py-2 font-medium rounded-md ${
                    section.id === currentSection.id
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  {section.title}
                </div>

                <div className="space-y-1 pl-4">
                  {section.lectures.map((lecture) => {
                    const isCurrent = lecture.id === currentLecture.id;
                    const isCompleted = false; // You would check this from the database

                    return (
                      <Link
                        key={lecture.id}
                        href={`/course/${slug}/${section.id}/${lecture.id}`}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                          isCurrent
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lecture.type === "VIDEO" && (
                            <Icons.playCircle
                              className={`h-4 w-4 ${
                                isCurrent
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          )}
                          {lecture.type === "QUIZ" && (
                            <Icons.helpCircle
                              className={`h-4 w-4 ${
                                isCurrent
                                  ? "text-blue-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          )}
                          {lecture.type === "EXERCISE" && (
                            <Icons.pencil
                              className={`h-4 w-4 ${
                                isCurrent
                                  ? "text-green-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          )}
                        </div>
                        <span className="truncate">{lecture.title}</span>
                        {isCompleted && (
                          <span className="ml-auto">
                            <Check className="h-4 w-4 text-green-500" />
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Video/Content Area */}
          <div className="flex-1 bg-black">
            {currentLecture.type === "VIDEO" && currentLecture.videoLecture && (
              <CoursePlayer
                videoUrl={currentLecture.videoLecture.videoUrl}
                videoName={currentLecture.videoLecture.videoName}
                duration={currentLecture.videoLecture.duration}
              />
            )}

            {currentLecture.type === "QUIZ" && currentLecture.quizLecture && (
              <Quiz
                questions={currentLecture.quizLecture.questions}
                lectureId={currentLecture.id}
                courseId={course.id}
                userId={user?.id || ""}
              />
            )}

            {currentLecture.type === "EXERCISE" &&
              currentLecture.exerciseLecture && (
                <div className="flex items-center justify-center h-full">
                  <div className="max-w-2xl p-8 text-center">
                    <Icons.pencil className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      Exercise: {currentLecture.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {currentLecture.exerciseLecture.instructions}
                    </p>
                    <Button>Download Exercise Files</Button>
                  </div>
                </div>
              )}
          </div>

          {/* Lecture Info and Navigation */}
          <div className="border-t bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{currentLecture.title}</h2>
                  <p className="text-muted-foreground mt-1">
                    {currentLecture.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  {nextLecture ? (
                    <Link
                      href={`/course/${slug}/${
                        nextLecture.sectionId || currentSection.id
                      }/${nextLecture.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  ) : (
                    <Link
                      href={`/course/${slug}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Complete Course
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
