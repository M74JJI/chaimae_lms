"use client";
import { Button } from "@/components/ui/button";
import { Course, InstructorProfile, User } from "@prisma/client";
import { useCart } from "../context/cart-context";

export default function AddToCartButton({
  course,
}: {
  course: Course & { instructorProfile: InstructorProfile & { user: User } };
}) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { id, title, subtitle, price, thumbnail } = course;
  if (!id || !title || !subtitle || !price || !thumbnail) return null;
  console.log(course);
  return (
    <div>
      <Button
        variant="outline"
        className="w-full h-14 rounded-xl text-lg font-semibold border-2"
        onClick={() =>
          addToCart({
            id,
            title,
            subtitle,
            price,
            thumbnail,
            instructor: course.instructorProfile.user.name,
            rating: course.rating,
            numReviews: course.numReviews,
            duration: course.duration,
            numLectures: course.numLectures,
            level:
              course.difficultyLevel == "ALL"
                ? "All Levels"
                : course.difficultyLevel,
          })
        }
      >
        Add T Cart
      </Button>
    </div>
  );
}
