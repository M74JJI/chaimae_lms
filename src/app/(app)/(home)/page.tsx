import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { CourseCarousel } from "@/modules/home/components/course-carousel";
import { StatsBanner } from "@/modules/home/components/stats-banner";
import { InstructorSpotlight } from "@/modules/home/components/instructor-spotlight";
import { TestimonialsSection } from "@/modules/home/components/testimonials";
import Header from "@/components/layout/header/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, GraduationCap } from "lucide-react";
import HomeHero from "@/modules/home/components/hero";
import Cta from "@/modules/home/components/cta";
import Link from "next/link";

export default async function Home() {
  // Fetch featured data from database
  const [featuredCourses, popularCourses, newCourses, categories] =
    await Promise.all([
      db.course.findMany({
        //   where: { isFeatured: true },
        include: {
          instructorProfile: { include: { user: true } },
          category: true,
        },
        take: 6,
      }),
      db.course.findMany({
        // where: { isPopular: true },
        include: {
          instructorProfile: { include: { user: true } },
          category: true,
        },
        take: 8,
      }),
      db.course.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          instructorProfile: { include: { user: true } },
          category: true,
        },
        take: 4,
      }),
      db.category.findMany({
        take: 10,
      }),
    ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <HomeHero />

      {/* Trusted By Educational Institutions */}
      <section className="py-16 bg-blue-50/50 dark:!bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-3">
              Trusted by educational leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              EduNest is the preferred learning platform for top institutions
              worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-center">
            {[
              { name: "Harvard", logo: "/assets/images/schools/harvard.png" },
              {
                name: "Stanford",
                logo: "/assets/images/schools/stanford.webp",
              },
              { name: "MIT", logo: "/assets/images/schools/mit.png" },
              {
                name: "Cambridge",
                logo: "/assets/images/schools/cambridge.png",
              },
              { name: "ETH Zurich", logo: "/assets/images/schools/eth.png" },
            ].map((institution) => (
              <div
                key={institution.name}
                className="flex items-center justify-center group cursor-pointer"
              >
                <div className="relative h-16 w-32 transition-all duration-300 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0">
                  <Image
                    src={institution.logo}
                    alt={institution.name}
                    fill
                    className="object-contain"
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* Academic seal of approval */}
          <div className="mt-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-3 bg-background px-6 py-3 rounded-full border border-blue-200 shadow-sm">
              <div className="bg-blue-100 p-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600">
                Accredited by International Education Standards
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Categories Section */}
      <section className="py-16 bg-blue-50/20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2">
                Explore Learning Paths
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Discover a World of Knowledge
              </h3>
            </div>
            <Link href="/browse">
              <Button
                variant="outline"
                className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="group/category relative h-full">
                {/* Gradient background effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white to-blue-50/70 border border-gray-200/60 group-hover/category:border-blue-300/50 transition-all duration-300 shadow-sm group-hover/category:shadow-md -z-10" />

                {/* Content */}
                <div className="p-5 h-full flex flex-col">
                  {/* Creative text treatment */}
                  <div className="relative mb-4">
                    <span className="text-4xl font-bold text-gray-200/70 absolute -left-1 -top-3 group-hover/category:text-blue-100/80 transition-colors">
                      {category.name.slice(0, 1)}
                    </span>
                    <h3 className="font-medium text-gray-900 group-hover/category:text-blue-600 transition-colors relative z-10 pl-6">
                      {category.name.split(" ").map((word, i) => (
                        <span key={i} className="block leading-tight">
                          {word}
                        </span>
                      ))}
                    </h3>
                  </div>

                  {/* Interactive elements */}
                  <Link
                    href={`/browse?category=${category.url}`}
                    className="mt-auto pt-2"
                  >
                    <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover/category:text-blue-500 transition-colors">
                      <span>Browse courses</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover/category:opacity-100 transition-all duration-300 translate-x-0 group-hover/category:translate-x-1" />
                    </div>

                    {/* Animated underline */}
                    <div className="relative mt-2 h-px w-full bg-gray-200 overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-blue-400 to-blue-600 group-hover/category:w-full transition-all duration-500" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-blue-50/20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-2">
                Learn with EduNest
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured Academic Programs
              </h3>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700"
            >
              Browse All Courses
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <CourseCarousel courses={featuredCourses} />
        </div>
      </section>

      {/* Stats Banner */}
      <StatsBanner />

      {/* Instructor Spotlight */}
      <InstructorSpotlight />

      {/* Testimonials */}
      <TestimonialsSection />
      {/* CTA Section - Futuristic Learning Hub */}
      <Cta />
    </div>
  );
}
