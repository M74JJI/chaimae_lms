"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, Users, ArrowRight, ChevronRight } from "lucide-react";

export function InstructorSpotlight() {
  const featuredInstructor = {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Senior AI Researcher",
    bio: "Former Google AI lead with 10+ years of experience in machine learning and neural networks. Her courses have helped over 45,000 students master cutting-edge AI concepts.",
    image: "/instructor.jpg",
    coursesCount: 12,
    studentsCount: 45000,
    rating: 4.9,
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* **Floating Gradient Orbs (Background Depth)** */}
      <div className="absolute -top-20 left-1/4 w-64 h-64 rounded-full bg-blue-600/10 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-emerald-600/10 blur-[100px] animate-float-slow delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* **Animated Section Header** */}
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
          <span className="inline-block animate-text-shine bg-[length:200%]">
            Spotlight Instructor
          </span>
        </h2>

        {/* **3D Glass Card (Frosted Glass Effect)** */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 group/card">
          <div className="grid md:grid-cols-3 gap-0">
            {/* **Instructor Image (Hover Zoom + Vignette)** */}
            <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden">
              <Image
                src={featuredInstructor.image}
                alt={featuredInstructor.name}
                fill
                className="object-cover group-hover/card:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* **Floating Badge (Top Instructor)** */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                <Star className="h-3 w-3 fill-white" />
                <span>TOP 1% INSTRUCTOR</span>
              </div>
            </div>

            {/* **Instructor Details (Interactive Stats)** */}
            <div className="md:col-span-2 p-8 md:p-10 space-y-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors">
                  {featuredInstructor.name}
                </h3>
                <p className="text-muted-foreground">
                  {featuredInstructor.title}
                </p>
              </div>

              <p className="text-gray-700 group-hover/card:text-gray-800 transition-colors">
                {featuredInstructor.bio}
              </p>

              {/* **Animated Stats (Hover Effects)** */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 bg-blue-50/50 hover:bg-blue-100/50 px-4 py-2 rounded-lg transition-all group/stat">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover/stat:bg-blue-200 transition-colors">
                    <Star className="h-5 w-5 text-blue-600 group-hover/stat:text-blue-700" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">
                      {featuredInstructor.rating}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Rating
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50/50 hover:bg-emerald-100/50 px-4 py-2 rounded-lg transition-all group/stat">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover/stat:bg-emerald-200">
                    <BookOpen className="h-5 w-5 text-emerald-600 group-hover/stat:text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">
                      {featuredInstructor.coursesCount}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Courses
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-purple-50/50 hover:bg-purple-100/50 px-4 py-2 rounded-lg transition-all group/stat">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover/stat:bg-purple-200">
                    <Users className="h-5 w-5 text-purple-600 group-hover/stat:text-purple-700" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">
                      {Math.floor(featuredInstructor.studentsCount / 1000)}K+
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Students
                    </span>
                  </div>
                </div>
              </div>

              {/* **Holographic Button (3D Effect)** */}
              <Button
                asChild
                size="lg"
                className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-500/30 transition-all group/button"
              >
                <Link
                  href={`/instructors/${featuredInstructor.id}`}
                  className="flex items-center gap-2"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// **Add to global CSS**
<style jsx global>{`
  @keyframes float-slow {
    0%,
    100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
  }
  @keyframes text-shine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`}</style>;
