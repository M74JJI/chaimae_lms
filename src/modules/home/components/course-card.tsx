import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Star,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    price?: number;
    isBestseller?: boolean;
    rating: number;
    numStudents?: number;
    duration?: string;
    level?: string;
    category: {
      name: string;
    };
    instructorProfile: {
      user: {
        name: string;
        image?: string;
      };
    };
  };
  variant?: "default" | "new" | "featured";
}

export function CourseCard({ course, variant = "default" }: CourseCardProps) {
  return (
    <div className="group/card relative h-full">
      {/* Glassmorphism background with layered effects */}
      <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-500 group-hover/card:bg-white/90 group-hover/card:backdrop-blur-md border border-gray-200/70 group-hover/card:border-blue-300/50 shadow-sm group-hover/card:shadow-md -z-10" />

      {/* Floating highlight on hover */}
      <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Main card content */}
      <div className="h-full flex flex-col p-1.5">
        {/* Image container with floating badges */}
        <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-blue-50/50 to-gray-100/30 group-hover/card:bg-blue-50/70 transition-colors duration-300">
          <Image
            src={course.thumbnail || "/academic-placeholder.jpg"}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
            priority
          />

          {/* Floating badges with subtle animations */}
          <div className="absolute top-3 left-3 flex gap-2">
            {variant === "new" && (
              <Badge className="bg-emerald-600 hover:bg-emerald-600/90 text-white shadow-md flex items-center gap-1 px-2 py-1 transform transition-all duration-300 group-hover/card:-translate-y-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                NEW
              </Badge>
            )}
            {variant === "featured" && (
              <Badge className="bg-blue-600 hover:bg-blue-600/90 text-white shadow-md flex items-center gap-1 px-2 py-1 transform transition-all duration-300 group-hover/card:-translate-y-1">
                <Star className="h-3 w-3 fill-white" />
                FEATURED
              </Badge>
            )}
            {course.isBestseller && (
              <Badge className="bg-yellow-500 hover:bg-yellow-500/90 text-yellow-900 shadow-md flex items-center gap-1 px-2 py-1 transform transition-all duration-300 group-hover/card:-translate-y-1">
                <BookOpen className="h-3 w-3" />
                TOP RATED
              </Badge>
            )}
          </div>

          {/* Enrollment CTA with stunning hover animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex items-end p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />

            <Button
              className="w-full translate-y-10 group-hover/card:translate-y-0 transition-transform duration-500 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-xl hover:shadow-blue-500/20 group/button"
              asChild
            >
              <Link
                href={`/course/${course.slug}`}
                className="flex items-center justify-center gap-2"
              >
                <span className="relative overflow-hidden">
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">Enroll Now</span>
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Course details */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Category and level */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="text-xs bg-blue-100/80 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group-hover/card:bg-blue-100">
              {course.category.name}
            </Badge>
            {course.level && (
              <Badge
                variant="outline"
                className="text-xs border-gray-300 group-hover/card:border-blue-200 transition-colors"
              >
                {course.level}
              </Badge>
            )}
          </div>

          {/* Course title and subtitle */}
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover/card:text-blue-600 transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 group-hover/card:text-gray-700 transition-colors">
            {course.subtitle}
          </p>

          {/* Course metadata */}
          <div className="mt-auto space-y-3">
            {/* Rating and students */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-700 group-hover/card:text-yellow-800 transition-colors">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 group-hover/card:fill-yellow-600 group-hover/card:text-yellow-600 transition-colors" />
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-gray-400 group-hover/card:text-gray-500 transition-colors">
                  /5.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 group-hover/card:text-gray-700 transition-colors">
                <Users className="h-4 w-4 text-gray-500 group-hover/card:text-gray-600 transition-colors" />
                <span>{(course.numStudents || 0).toLocaleString()}+</span>
              </div>
              {course.duration && (
                <div className="flex items-center gap-1.5 text-gray-600 group-hover/card:text-gray-700 transition-colors">
                  <Clock className="h-4 w-4 text-gray-500 group-hover/card:text-gray-600 transition-colors" />
                  <span>{course.duration}</span>
                </div>
              )}
            </div>

            {/* Instructor and price */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200/70 group-hover/card:border-blue-200/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover/card:border-blue-100 transition-colors">
                  <Image
                    src={
                      course.instructorProfile.user.image ||
                      "/educator-avatar.jpg"
                    }
                    width={32}
                    height={32}
                    alt={course.instructorProfile.user.name}
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-200/30 group-hover/card:to-blue-100/20 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover/card:text-blue-600 transition-colors">
                  Prof. {course.instructorProfile.user.name.split(" ")[0]}
                </span>
              </div>

              <div className="text-right">
                {course.price ? (
                  <>
                    <span className="font-bold text-blue-600 group-hover/card:text-blue-700 transition-colors">
                      ${course.price}
                    </span>
                    {course.price > 50 && (
                      <span className="block text-xs text-gray-400 group-hover/card:text-gray-500 line-through transition-colors">
                        ${Math.round(course.price * 1.5)}
                      </span>
                    )}
                  </>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 px-3 py-1 group-hover/card:bg-emerald-200/80 group-hover/card:text-emerald-800 transition-colors">
                    FREE
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover/card:border-blue-300/30 pointer-events-none transition-all duration-500" />
    </div>
  );
}
