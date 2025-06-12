"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { User } from "lucide-react";

export function FeaturedCourseCard({ course }: { course: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left - width / 2) / 25);
    mouseY.set((e.clientY - top - height / 2) / 25);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateY: useMotionTemplate`${mouseX}deg`,
        rotateX: useMotionTemplate`${mouseY}deg`,
      }}
      whileHover={{ scale: 1.03 }}
      className="perspective-1000"
    >
      <Card className="relative overflow-hidden group h-full">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="p-0 relative">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                asChild
                className="w-full translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
              >
                <Link href={`/courses/${course.id}`}>Enroll Now</Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {course.category.name}
            </span>
            <div className="flex items-center gap-1 text-sm">
              <Icons.star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>{course.rating}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {course.subtitle}
          </p>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-background overflow-hidden">
              <Image
                src={course.instructorProfile.user.image}
                width={40}
                height={40}
                alt={course.instructorProfile.user.name}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">
                {course.instructorProfile.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {course.duration} hours
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex justify-between items-center">
          <span className="text-2xl font-bold">${course.price}</span>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {course.numStudents.toLocaleString()}
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
