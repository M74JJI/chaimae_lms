"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare } from "lucide-react";

export default function Cta() {
  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-900/5 via-background to-emerald-900/5">
      {/* **Floating 3D Elements (Pure CSS)** */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-600/10 blur-[100px] animate-float-slow" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-600/10 blur-[100px] animate-float-slow delay-1000" />

      {/* **Grid Mesh Background (Subtle Tech Vibe)** */}
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]">
        <div className="h-full w-full [background-size:24px_24px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* **Animated Typography (Gradient + Shine Effect)** */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%] animate-text-shine">
            Ready to <span className="italic">Elevate</span> Your Learning?
          </span>
        </h2>

        {/* **Interactive Subtitle (Hover Effect)** */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 group">
          <span className="bg-gradient-to-r from-foreground/80 to-foreground bg-clip-text text-transparent transition-all duration-500 group-hover:translate-y-1 inline-block">
            Join <span className="font-bold text-blue-600">50,000+</span>{" "}
            students mastering skills with
            <span className="relative ml-2">
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-400/50 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <span className="relative font-bold text-emerald-600">
                EduNest.
              </span>
            </span>
          </span>
        </p>

        {/* **Holographic Buttons (3D Glass Effect)** */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button className="px-12 py-7 text-lg rounded-xl bg-gradient-to-br from-blue-600/90 to-blue-500 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group relative overflow-hidden border border-blue-400/20 hover:border-blue-400/40">
            <span className="relative z-10 flex items-center gap-3">
              <BookOpen className="h-6 w-6 transition-all group-hover:rotate-12 group-hover:scale-110" />
              <span>Explore Courses</span>
            </span>
            {/* **Hover Glow Effect** */}
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(59,130,246,0.3)_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </Button>

          <Button
            variant="outline"
            className="px-12 py-7 text-lg rounded-xl border-2 border-gray-300/50 hover:border-blue-400/50 bg-background/80 backdrop-blur-lg shadow-lg hover:shadow-emerald-400/20 transition-all group relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600 group-hover:text-emerald-500 transition-colors" />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-emerald-600 transition-all">
                Talk to an Advisor
              </span>
            </span>
            {/* **Hover Pulse Ring** */}
            <span className="absolute inset-0 rounded-xl border-2 border-blue-400/0 group-hover:border-blue-400/30 group-hover:animate-pulse-ring transition-all duration-500 -z-10 pointer-events-none" />
          </Button>
        </div>

        {/* **Floating Student Avatars (Social Proof)** */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-emerald-100 shadow-inner"
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              <span className="text-blue-600">92%</span> of students achieve
              their goals
            </span>
          </div>
        </div>
      </div>

      {/* **Add to global CSS** */}
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
        @keyframes pulse-ring {
          0% {
            opacity: 0.5;
            transform: scale(1);
          }
          80% {
            opacity: 0;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
