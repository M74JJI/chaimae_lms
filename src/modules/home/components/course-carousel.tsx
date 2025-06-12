"use client";

import { CourseCard } from "./course-card";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function CourseCarousel({ courses }: { courses: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount =
        direction === "left" ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6 pb-8 -mr-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="snap-start min-w-[300px] max-w-[350px] flex-shrink-0"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons with Academic Icons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 border border-blue-200/50 hover:border-blue-300 hidden group-hover:flex items-center justify-center"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-5 w-5 text-blue-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 border border-blue-200/50 hover:border-blue-300 hidden group-hover:flex items-center justify-center"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-5 w-5 text-blue-600" />
      </Button>
    </div>
  );
}
