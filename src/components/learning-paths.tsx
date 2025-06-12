"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LearningPathSection({ paths }: { paths: any[] }) {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Learning Paths</h2>
            <p className="text-muted-foreground">
              Structured roadmaps to master complex topics
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/paths">View All</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path) => (
            <motion.div
              key={path.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full group overflow-hidden">
                <CardHeader className="p-0 relative aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-background z-10" />
                  <div className="absolute inset-0 bg-[url('/path-pattern.svg')] bg-[size:200px] opacity-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {path.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      {path.courses.length} courses
                    </span>
                    <span className="text-sm font-medium">
                      {path.duration} hours
                    </span>
                  </div>

                  <Progress value={path.progress} className="h-2 mb-4" />

                  <div className="flex flex-wrap gap-2 mb-6">
                    {path.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-secondary rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/paths/${path.id}`}>
                      {path.progress > 0 ? "Continue Path" : "Start Path"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
