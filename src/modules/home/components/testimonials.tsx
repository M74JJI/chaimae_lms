"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Software Engineer",
      content:
        "This platform completely transformed my career. The quality of instruction is unmatched—I went from beginner to hired in 6 months!",
      rating: 5,
      image: "/testimonial1.jpg",
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "UX Designer",
      content:
        "I've taken many online courses, but none were as comprehensive and well-structured as these. The projects mirror real-world challenges perfectly.",
      rating: 5,
      image: "/testimonial2.jpg",
    },
    {
      id: 3,
      name: "James Wilson",
      role: "Data Scientist",
      content:
        "The hands-on projects gave me the practical experience I needed to land my dream job at a FAANG company. Worth every penny.",
      rating: 4,
      image: "/testimonial3.jpg",
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-blue-50/30 to-background">
      {/* **Floating Gradient Orbs (Background Depth)** */}
      <div className="absolute -top-20 left-1/4 w-64 h-64 rounded-full bg-blue-600/10 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-emerald-600/10 blur-[100px] animate-float-slow delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* **Animated Header (Gradient + Shine)** */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
            Voices of Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don’t take our word for it—here’s what our students say about their
            transformative learning journeys.
          </p>
        </motion.div>

        {/* **3D Testimonial Cards (Hover Effects + Animation)** */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.15, duration: 0.6 },
                },
              }}
            >
              <Card className="group/card h-full bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-blue-300/50 shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* **Quote Icon (Animated on Hover)** */}
                  <Quote className="h-8 w-8 text-blue-400/30 group-hover/card:text-blue-500/50 mb-4 transition-all duration-500" />

                  {/* **Stars (Dynamic Rating)** */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400 group-hover/card:fill-yellow-500 group-hover/card:text-yellow-500"
                            : "fill-gray-200 text-gray-300"
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>

                  {/* **Testimonial Text (Animated Underline)** */}
                  <p className="italic text-gray-700 mb-8 group-hover/card:text-gray-800 transition-colors relative">
                    "{testimonial.content}"
                    <span className="absolute -bottom-4 left-0 h-0.5 w-0 bg-blue-500 group-hover/card:w-full transition-all duration-700" />
                  </p>

                  {/* **Student Profile (Hover Slide-Up)** */}
                  <div className="mt-auto flex items-center gap-4 group-hover/card:-translate-y-1 transition-transform duration-500">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md group-hover/card:border-blue-200 transition-colors">
                      <AvatarImage src={testimonial.image} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {testimonial.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover/card:text-blue-600 transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover/card:text-gray-700 transition-colors">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
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
`}</style>;
