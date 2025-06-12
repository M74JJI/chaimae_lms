"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen max-h-[800px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span className="text-primary">Learn</span> what excites you
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Master new skills with project-based courses from industry experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="text-lg px-8 py-6">Explore Courses</Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              <Icons.play className="mr-2 h-5 w-5" />
              How it works
            </Button>
          </div>
        </motion.div>

        {/* Scrolling Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </div>
    </section>
  );
}
