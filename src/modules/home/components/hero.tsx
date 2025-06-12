"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  LampDesk,
  NotebookPen,
  PlayCircle,
  Rocket,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";

export default function EduNestHero() {
  return (
    <section className="relative bg-background overflow-hidden isolate">
      {/* Academic-themed gradient background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-emerald-500/5 opacity-20" />
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f620,transparent,transparent)] animate-[spin_60s_linear_infinite]" />
      </div>

      {/* Floating knowledge elements (books, caps) */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-blue-500/20"
            style={{
              fontSize: `${Math.random() * 24 + 16}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {Math.random() > 0.5 ? <BookOpen /> : <GraduationCap />}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 max-w-2xl">
            {/* EduNest trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium bg-background text-blue-600 border border-blue-200 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <Star className="h-4 w-4 fill-blue-500 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-0" />
              </div>
              <span>Trusted by 50,000+ students globally</span>
              <Users className="h-4 w-4 ml-1" />
            </div>

            {/* Headline with academic focus */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent animate-gradient bg-[length:300%]">
                  Elevate
                </span>
                <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-transparent opacity-80" />
              </span>{" "}
              your learning with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  EduNest's
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-emerald-400/30 -rotate-1 rounded-full" />
              </span>{" "}
              smart platform
            </h1>

            {/* Educational subtitle */}
            <p className="text-xl text-muted-foreground group">
              <span className="inline-flex flex-col">
                <span className="transition-all duration-300 group-hover:text-foreground/80">
                  University-quality courses with interactive lessons,
                </span>
                <span className="font-medium text-foreground transition-all duration-300 group-hover:text-blue-600">
                  personalized learning paths, and expert instructors.
                </span>
              </span>
            </p>

            {/* Academic CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="text-lg px-8 h-14 rounded-xl hover:shadow-lg transition-all group relative overflow-hidden bg-blue-600 hover:bg-blue-700"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="h-5 w-5 transition-transform group-hover:rotate-45" />
                  <span>Explore Courses</span>
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 rounded-xl border-2 hover:bg-accent/5 hover:shadow-sm group bg-background/80 backdrop-blur-sm border-blue-300"
              >
                <div className="relative">
                  <PlayCircle className="mr-2 h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span>How EduNest Works</span>
              </Button>
            </div>

            {/* Student success metrics */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8">
              <div className="flex">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Avatar
                      key={i}
                      className="h-11 w-11 border-2 border-background hover:-translate-y-1 transition-transform hover:z-10 hover:shadow-md"
                    >
                      <AvatarImage src={`/students/student-${i}.jpg`} />
                      <AvatarFallback>S{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="flex items-center justify-center -ml-2 h-11 w-11 rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +1.2K
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">92%</span> of
                  students report career advancement
                </p>
              </div>
            </div>
          </div>

          {/* Hero image with academic floating elements */}
          <div className="relative">
            <div className="relative aspect-[1.1] rounded-3xl overflow-hidden shadow-2xl border border-border/20 bg-gradient-to-br from-background to-muted/50">
              <Image
                src="/assets/images/hero.png"
                alt="Students learning on EduNest platform"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

              {/* Floating course completion card */}
              <div className="absolute bottom-5 right-5 w-72 bg-background rounded-2xl shadow-2xl border border-border/30 p-5 hidden lg:block transform transition-all hover:scale-[1.02] hover:shadow-xl group overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-xl flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <NotebookPen className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-medium">Learning Path</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Computer Science Fundamentals
                    </p>
                    <div className="mt-3 w-full bg-muted/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full h-2 w-3/4 transition-all duration-1000 ease-out"
                        style={{
                          animation: "progressBar 2s ease-out forwards",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        8 modules completed
                      </span>
                      <span className="text-xs font-medium text-blue-600">
                        3 certifications
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating course categories */}
            <div className="absolute -top-6 -left-6 w-52 h-64 bg-background/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-200/20 p-4 hidden lg:block transform rotate-3 hover:rotate-0 transition-transform">
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2 text-blue-600">
                  <LampDesk className="h-4 w-4" />
                  Popular Subjects
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      icon: <BookOpen className="h-4 w-4 text-blue-500" />,
                      name: "Computer Science",
                    },
                    {
                      icon: <Video className="h-4 w-4 text-emerald-500" />,
                      name: "Digital Arts",
                    },
                    {
                      icon: (
                        <GraduationCap className="h-4 w-4 text-purple-500" />
                      ),
                      name: "Business Admin",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="bg-muted/20 p-1.5 rounded-lg">
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        120+
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement badge floating element */}
            <div className="absolute -bottom-10 left-1/4 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full p-2 shadow-lg border border-white/20 hidden lg:block animate-float">
              <div className="bg-background rounded-full p-3">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 75%;
          }
        }
      `}</style>
    </section>
  );
}
