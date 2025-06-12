import { auth } from "@/auth";
import Header from "@/components/layout/header/header";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import AddToCartButton from "@/modules/cart/components/add-to-cart-btn";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Rating } from "@/components/ui/rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Award,
  Book,
  ChevronDown,
  Clock,
  Download,
  Globe,
  LifeBuoy,
  List,
  Share,
  ShieldCloseIcon,
  User,
  User2,
  Users,
} from "lucide-react";
import { MdMobileFriendly } from "react-icons/md";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentUser = await auth();
  const user = currentUser?.user;

  // Fetch main course data
  const course = await db.course.findUnique({
    where: { slug },
    include: {
      sections: {
        include: {
          lectures: {
            include: {
              videoLecture: true,
              exerciseLecture: true,
              quizLecture: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      language: true,
      instructorProfile: {
        include: {
          user: true,
          socialLinks: true,
          courses: {
            where: { slug: { not: slug } },
            take: 2,
            include: { language: true },
          },
        },
      },
      category: {
        include: {
          courses: {
            where: { slug: { not: slug } },
            take: 2,
            include: {
              language: true,
              instructorProfile: { include: { user: true } },
            },
          },
        },
      },
      subcategory: true,
    },
  });

  if (!course) redirect("/");

  const isEnrolled = false;
  const totalDuration = course.sections.reduce((total, section) => {
    return (
      total +
      section.lectures.reduce((secTotal, lecture) => {
        return secTotal + (lecture.videoLecture?.duration || 0);
      }, 0)
    );
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const formattedDuration = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-background">
        <div className="container mx-auto px-4  md:py-20">
          {/* Split Hero Section into Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 p-8 rounded-3xl shadow-md border border-white/20 dark:border-gray-700/30">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                  {course.category.name}
                </Badge>
                {course.subcategoryId && (
                  <Badge className="bg-white/90 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                    {course.subcategory ? course.subcategory.name : "-"}
                  </Badge>
                )}
                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-0">
                  {course.language?.native}
                </Badge>
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 flex items-center">
                  <Icons.star className="h-4 w-4 mr-1" />
                  Bestseller
                </Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                {course.title}
              </h1>

              <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mt-4 max-w-3xl">
                {course.subtitle}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Rating value={course.rating} />
                  <span className="font-medium">
                    {course.rating.toFixed(1)} (
                    {course.numReviews.toLocaleString()} ratings)
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="flex items-center gap-2">
                  <Icons.video className="h-5 w-5" />
                  <span>{course.numLectures.toLocaleString()} lectures</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400" />
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formattedDuration} total length</span>
                </div>
              </div>
              {/* Rest of the content below */}
              <div className="w-full mt-5">
                <div className="lg:col-span-2 space-y-8">
                  {/* Instructor Card with Modern Design */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                        <Image
                          src={
                            course.instructorProfile.user.image ||
                            "/default-avatar.jpg"
                          }
                          width={80}
                          height={80}
                          alt={course.instructorProfile.user.name}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          Created by {course.instructorProfile.user.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {course.instructorProfile.bio ||
                            "Professional Instructor"}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Book className="h-4 w-4" />
                            {course.instructorProfile.courses.length + 1}+
                            Courses
                          </Badge>
                          <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <User className="h-4 w-4" />
                            10K+ Students
                          </Badge>
                          <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Icons.star className="h-4 w-4 text-amber-500" />
                            4.8 Instructor Rating
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" className="shrink-0">
                        <User2 className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    </div>
                  </div>

                  {/* Key Features with Icons */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                          <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Certificate
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Earn a professional certificate upon completion
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                          <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Resources
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Downloadable exercises and project files
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                          <Icons.deviceMobile className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Mobile Access
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Learn on the go with our mobile app
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                          <LifeBuoy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                            Support
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Q&A support and direct instructor access
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Empty right column to maintain grid alignment */}
                <div className="hidden lg:block"></div>
              </div>
            </div>

            {/* Right Card - Sticky Sidebar */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="overflow-hidden rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="relative aspect-video group">
                  <Image
                    src={course.thumbnail || "/course-placeholder.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {course.promotionalVideo && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all">
                          <div className="rounded-full bg-white p-5 shadow-xl transform group-hover:scale-110 transition-transform">
                            <Icons.play className="h-6 w-6 text-indigo-600" />
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl p-0 aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                          poster={course.thumbnail || undefined}
                        >
                          <source
                            src={course.promotionalVideo}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {course.price ? `$${course.price.toFixed(2)}` : "Free"}
                    </span>
                    {course.price && (
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ${(course.price * 1.2).toFixed(2)}
                      </span>
                    )}
                    {course.price && (
                      <span className="ml-auto bg-gradient-to-r from-green-400 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Limited Time Offer
                      </span>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-lg">
                      <Icons.playCircle className="h-5 w-5 mr-2" />
                      Continue Learning
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg font-semibold shadow-lg">
                        Enroll Now
                      </Button>
                      <AddToCartButton course={course} />
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-3 border-y border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-2">
                      <ShieldCloseIcon className="h-5 w-5 text-green-500" />
                      30-Day Money-Back Guarantee
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Course Includes:
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-center gap-3">
                        <Icons.video className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        <span>{formattedDuration} on-demand video</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        <span>18 downloadable resources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Icons.deviceMobile className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Icons.badge className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Icons.infinity className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Full lifetime access</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Share className="h-5 w-5" />
                      Share this course
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn - Modern Card */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                What you'll learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.objectives.map((objective, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <Icons.check className="h-6 w-6 mt-0.5 text-green-500 flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-1 rounded-full" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {objective}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content - Modern Accordion */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Course content
                </h2>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <List className="h-5 w-5" />
                    {course.sections.length} sections
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.video className="h-5 w-5" />
                    {course.numLectures} lectures
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-5 w-5" />
                    {formattedDuration}
                  </span>
                </div>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["section-0"]}
                className="space-y-2"
              >
                {course.sections.map((section, sectionIndex) => {
                  const sectionDuration = section.lectures.reduce(
                    (total, lecture) =>
                      total + (lecture.videoLecture?.duration || 0),
                    0
                  );

                  return (
                    <AccordionItem
                      key={section.id}
                      value={`section-${sectionIndex}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="hover:no-underline px-5 py-4 bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center gap-4 w-full">
                          <div className="text-left flex-1">
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {section.lectures.length} lectures •{" "}
                              {Math.floor(sectionDuration / 60)}m
                            </p>
                          </div>
                          <ChevronDown className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0 bg-white dark:bg-gray-800">
                        <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {lecture.type === "VIDEO" && (
                                  <div className="bg-blue-100 dark:bg-blue-900/20 p-1.5 rounded-lg">
                                    <Icons.playCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                )}
                                {lecture.type === "QUIZ" && (
                                  <div className="bg-purple-100 dark:bg-purple-900/20 p-1.5 rounded-lg">
                                    <Icons.helpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                )}
                                {lecture.type === "EXERCISE" && (
                                  <div className="bg-green-100 dark:bg-green-900/20 p-1.5 rounded-lg">
                                    <Icons.pencil className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {lecture.title}
                                </p>
                                {lecture.videoLecture?.duration && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {Math.floor(
                                      lecture.videoLecture.duration / 60
                                    )}
                                    :
                                    {(lecture.videoLecture.duration % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </p>
                                )}
                              </div>
                              {isEnrolled ? (
                                <Link
                                  href={`/course/${course.slug}/${section.id}/${lecture.id}`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 border-2"
                                  >
                                    Start
                                  </Button>
                                </Link>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg">
                                      <Icons.lock className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Enroll to access this content
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>

            {/* Requirements - Modern Card */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Requirements
              </h2>
              <ul className="space-y-3">
                {course.prerequisites.map((req, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <Icons.circle className="h-6 w-6 mt-0.5 text-indigo-500 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 p-1 rounded-full" />
                    <p className="text-gray-700 dark:text-gray-300">{req}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description - Modern Card */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Description
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p>{course.description}</p>
              </div>
            </section>

            {/* Instructor - Modern Card */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Instructor
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                      <Image
                        src={
                          course.instructorProfile.user.image ||
                          "/default-avatar.jpg"
                        }
                        width={96}
                        height={96}
                        alt={course.instructorProfile.user.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {course.instructorProfile.user.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {course.instructorProfile.bio ||
                          "Professional Instructor"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Icons.star className="h-4 w-4 text-amber-500" />
                        4.7 Instructor Rating
                      </Badge>
                      <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Award className="h-4 w-4 text-blue-500" />
                        12,345 Reviews
                      </Badge>
                      <Badge className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Users className="h-4 w-4 text-green-500" />
                        45,678 Students
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400">
                      {course.instructorProfile.bio ||
                        "Experienced professional with years of hands-on experience in the field. Passionate about sharing knowledge and helping students achieve their goals."}
                    </p>

                    {course.instructorProfile.socialLinks && (
                      <div className="flex gap-4 pt-2">
                        {course.instructorProfile.socialLinks.website && (
                          <a
                            href={course.instructorProfile.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Globe className="h-5 w-5" />
                          </a>
                        )}
                        {course.instructorProfile.socialLinks.linkedin && (
                          <a
                            href={course.instructorProfile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Icons.linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {course.instructorProfile.socialLinks.github && (
                          <a
                            href={course.instructorProfile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Icons.github className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Who This Course Is For - Modern Card */}
            <Card className="border border-gray-100 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                  Who this course is for:
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {course.intendedLearners.map((learner, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
                    >
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-1 rounded-full">
                        <Icons.user className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {learner}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* More Courses by Instructor - Modern Card */}
            {course.instructorProfile.courses.length > 0 && (
              <Card className="border border-gray-100 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                    More from this instructor
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {course.instructorProfile.courses.map((instructorCourse) => (
                    <Link
                      key={instructorCourse.id}
                      href={`/courses/${instructorCourse.slug}`}
                      className="flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="relative aspect-video w-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={
                            instructorCourse.thumbnail ||
                            "/course-placeholder.jpg"
                          }
                          alt={instructorCourse.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                          {instructorCourse.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {instructorCourse.language?.native}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Rating
                            value={instructorCourse.rating || 0}
                            size={14}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({instructorCourse.numReviews || 0})
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Frequently Bought Together - Modern Card */}
            {course.category.courses.length > 0 && (
              <Card className="border border-gray-100 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                    Frequently bought together
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {course.category.courses.map((categoryCourse) => (
                    <Link
                      key={categoryCourse.id}
                      href={`/courses/${categoryCourse.slug}`}
                      className="flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="relative aspect-video w-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={
                            categoryCourse.thumbnail ||
                            "/course-placeholder.jpg"
                          }
                          alt={categoryCourse.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                          {categoryCourse.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            ${categoryCourse.price?.toFixed(2) || "Free"}
                          </span>
                          {categoryCourse.price && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                              ${(categoryCourse.price * 1.2).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Total price:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      $
                      {(course.price || 0) +
                        course.category.courses
                          .reduce((total, c) => total + (c.price || 0), 0)
                          .toFixed(2)}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Add all to cart
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
