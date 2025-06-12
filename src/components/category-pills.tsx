"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function CategoryPills({ categories }: { categories: any[] }) {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Explore by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="rounded-full px-6 py-3 h-auto flex flex-col items-center group"
                asChild
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="h-10 w-10 relative mb-2">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <h3 className="text-xl font-bold text-white">
                  {category.name}
                </h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                <Button variant="secondary" asChild>
                  <Link href={`/categories/${category.id}`}>
                    Browse Courses
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
