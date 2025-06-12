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

  const isEnrolled = true;
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{course.category.name}</Badge>
                  {course.subcategoryId && (
                    <Badge variant="outline">
                      {course.subcategory ? course.subcategory.name : "-"}
                    </Badge>
                  )}
                  <Badge variant="outline">{course.language?.native}</Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Bestseller
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {course.title}
                </h1>

                <h2 className="text-xl md:text-2xl text-muted-foreground mt-2">
                  {course.subtitle}
                </h2>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Rating value={course.rating} />
                    <span className="text-muted-foreground">
                      ({course.numReviews.toLocaleString()} ratings)
                    </span>
                  </div>
                  <span>•</span>
                  <span>{course.numLectures.toLocaleString()} lectures</span>
                  <span>•</span>
                  <span>{formattedDuration} total length</span>
                </div>
              </div>

              {/* Instructor with stats */}
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-background">
                  <Image
                    src={
                      course.instructorProfile.user.image ||
                      "/default-avatar.jpg"
                    }
                    width={56}
                    height={56}
                    alt={course.instructorProfile.user.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    Created by {course.instructorProfile.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {course.instructorProfile.bio || "Professional Instructor"}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold">
                      {course.instructorProfile.courses.length + 1}+
                    </div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">10K+</div>
                    <div className="text-xs text-muted-foreground">
                      Students
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">4.8</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  {/* <Icons.certificate className="h-6 w-6 text-primary" /> */}
                  <div>
                    <h4 className="font-medium">Certificate of Completion</h4>
                    <p className="text-sm text-muted-foreground">
                      Earn a certificate upon finishing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  {/*  <Icons.download className="h-6 w-6 text-primary" /> */}
                  <div>
                    <h4 className="font-medium">Downloadable Resources</h4>
                    <p className="text-sm text-muted-foreground">
                      Access to exercise files
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Action Card */}
            <div className="lg:sticky lg:top-20 h-fit">
              <Card className="overflow-hidden shadow-lg border-0">
                <div className="relative aspect-video">
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
                        <button className="absolute inset-0 flex items-center justify-center bg-black/30 group">
                          <div className="rounded-full bg-background p-4 shadow-lg transition group-hover:scale-110">
                            <Icons.play className="h-6 w-6 text-primary" />
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 aspect-video">
                        <div className="w-full h-full">
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
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">
                      {course.price ? `$${course.price.toFixed(2)}` : "Free"}
                    </span>
                    {course.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${(course.price * 1.2).toFixed(2)}
                      </span>
                    )}
                    {course.price && (
                      <span className="ml-auto bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Button className="w-full" size="lg">
                      Continue Learning
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        Enroll Now
                      </Button>
                      <AddToCartButton course={course} className="w-full" />
                    </div>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold">This course includes:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Icons.video className="h-4 w-4 flex-shrink-0" />
                        <span>{formattedDuration} on-demand video</span>
                      </li>
                      <li className="flex items-center gap-2">
                        {/* <Icons.download className="h-4 w-4 flex-shrink-0" /> */}
                        <span>18 downloadable resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icons.deviceMobile className="h-4 w-4 flex-shrink-0" />
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Icons.badge className="h-4 w-4 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="link"
                      className="w-full text-sm h-auto p-0"
                    >
                      Share this course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <section>
              <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icons.check className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                    <p>{objective}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Course content</h2>
                <div className="text-sm text-muted-foreground">
                  {course.sections.length} sections • {course.numLectures}{" "}
                  lectures • {formattedDuration} total length
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["section-0"]}>
                {course.sections.map((section, sectionIndex) => {
                  const sectionDuration = section.lectures.reduce(
                    (total, lecture) => {
                      return total + (lecture.videoLecture?.duration || 0);
                    },
                    0
                  );

                  return (
                    <AccordionItem
                      key={section.id}
                      value={`section-${sectionIndex}`}
                    >
                      <AccordionTrigger className="hover:no-underline px-4 py-3">
                        <div className="flex items-center gap-4">
                          {/*  <Icons.chevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" /> */}
                          <div className="text-left">
                            <h3 className="font-medium">{section.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {section.lectures.length} lectures •&nbsp;
                              {Math.floor(sectionDuration / 60)}m
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="space-y-1">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/50 rounded-md transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {lecture.type === "VIDEO" && (
                                  <Icons.playCircle className="h-5 w-5 text-primary" />
                                )}
                                {lecture.type === "QUIZ" && (
                                  <Icons.helpCircle className="h-5 w-5 text-blue-500" />
                                )}
                                {lecture.type === "EXERCISE" && (
                                  <Icons.pencil className="h-5 w-5 text-green-500" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium">{lecture.title}</p>
                                {lecture.videoLecture?.duration && (
                                  <p className="text-sm text-muted-foreground">
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
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0"
                                  >
                                    Start
                                  </Button>
                                </Link>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Icons.lock className="h-4 w-4 text-muted-foreground shrink-0" />
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

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Requirements</h2>
              <ul className="space-y-2">
                {course.prerequisites.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Icons.circle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                    <p>{req}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Description</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{course.description}</p>
              </div>
            </section>

            {/* Instructor */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Instructor</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-background">
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
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-bold">
                          {course.instructorProfile.user.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {course.instructorProfile.bio ||
                            "Professional Instructor"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Icons.star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span>4.7 Instructor Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {/*  <Icons.award className="h-4 w-4 fill-blue-500 text-blue-500" /> */}
                          <span>12,345 Reviews</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {/*  <Icons.users className="h-4 w-4 fill-green-500 text-green-500" /> */}
                          <span>45,678 Students</span>
                        </div>
                      </div>

                      <p className="text-sm">
                        {course.instructorProfile.bio ||
                          "Experienced professional with years of hands-on experience in the field. Passionate about sharing knowledge and helping students achieve their goals."}
                      </p>

                      {course.instructorProfile.socialLinks && (
                        <div className="flex gap-4 pt-2">
                          {course.instructorProfile.socialLinks.website && (
                            <a
                              href={
                                course.instructorProfile.socialLinks.website
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              {/* <Icons.globe className="h-5 w-5" /> */}
                            </a>
                          )}
                          {course.instructorProfile.socialLinks.linkedin && (
                            <a
                              href={
                                course.instructorProfile.socialLinks.linkedin
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Icons.linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {course.instructorProfile.socialLinks.github && (
                            <a
                              href={course.instructorProfile.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Icons.github className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Reviews */}
            {/*
        <>
            {course.reviews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Student feedback</h2>
                  <Button variant="link" className="text-sm h-auto p-0">
                    See all reviews
                  </Button>
                </div>

                <div className="space-y-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center space-y-2">
                      <div className="text-5xl font-bold">
                        {course.rating.toFixed(1)}
                      </div>
                      <Rating
                        value={course.rating}
                        className="justify-center"
                      />
                      <div className="text-sm text-muted-foreground">
                        Course Rating
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <div className="w-10 text-sm text-muted-foreground">
                            {stars} star
                          </div>
                          <Progress
                            value={(stars / 5) * 100}
                            className="h-2 flex-grow"
                          />
                          <div className="w-10 text-sm text-right text-muted-foreground">
                            {Math.floor((stars / 5) * course.numReviews)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    {course.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={review.user.image || "/default-avatar.jpg"}
                                width={40}
                                height={40}
                                alt={review.user.name || "User"}
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {review.user.name}
                              </h4>
                              <div className="flex items-center gap-1">
                                <Rating value={review.rating} size={14} />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p>{review.review}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}
        </>
        */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Who This Course Is For */}
            <Card>
              <CardHeader>
                <CardTitle>Who this course is for:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {course.intendedLearners.map((learner, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icons.user className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                      <p>{learner}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* More Courses by Instructor - Only shows if instructor has other courses */}
            {course.instructorProfile.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>More from this instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.instructorProfile.courses.map((instructorCourse) => (
                    <Link
                      key={instructorCourse.id}
                      href={`/courses/${instructorCourse.slug}`}
                      className="flex gap-4 hover:bg-secondary/50 p-2 rounded transition-colors"
                    >
                      <div className="relative aspect-video w-20 flex-shrink-0 rounded-md overflow-hidden">
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
                        <h4 className="font-medium line-clamp-2">
                          {instructorCourse.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {instructorCourse.language?.native}
                        </p>
                        <Rating
                          value={instructorCourse.rating || 0}
                          size={14}
                          className="mt-1"
                        />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Frequently Bought Together - From same category */}
            {course.category.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently bought together</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.category.courses.map((categoryCourse) => (
                    <Link
                      key={categoryCourse.id}
                      href={`/courses/${categoryCourse.slug}`}
                      className="flex gap-4 hover:bg-secondary/50 p-2 rounded transition-colors"
                    >
                      <div className="relative aspect-video w-20 flex-shrink-0 rounded-md overflow-hidden">
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
                        <h4 className="font-medium line-clamp-2">
                          {categoryCourse.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold">
                            ${categoryCourse.price?.toFixed(2) || "Free"}
                          </span>
                          {categoryCourse.price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${(categoryCourse.price * 1.2).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total price:</span>
                    <span className="font-bold">
                      $
                      {(course.price || 0) +
                        course.category.courses.reduce(
                          (total, c) => total + (c.price || 0),
                          0
                        )}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
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
