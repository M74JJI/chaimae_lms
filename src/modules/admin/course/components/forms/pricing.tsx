"use client";

// React
import { FC, useState } from "react";

// Prisma model

// Form handling utilities

// UI Components

import { Button } from "@/components/ui/button";
// Queries

// Utils

import { updateCourseAction } from "../../actions/course.actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface LandingProps {
  courseId: string;
  price: number;
}

const CoursePricingForm: FC<LandingProps> = ({ courseId, price }) => {
  const router = useRouter();
  const [priceData, setPriceData] = useState<number>(price);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await updateCourseAction(courseId, { price: priceData });

      if (response.success) {
        router.refresh();
      } else {
        setError("Failed to update. Please try again.");
      }
    } catch (error) {
      console.error("Error saving course data:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4 pl-3">
      <div>
        <div>
          <div className="border-stroke dark:border-dark-3 border-b">
            <h2 className="text-dark mb-2 text-2xl font-semibold dark:text-white">
              Course Pricing
            </h2>
            <p className="text-body-color dark:text-dark-6 mb-6 text-sm font-medium">
              Choose a price for your course
            </p>
          </div>
        </div>
      </div>
      <Input
        value={priceData}
        placeholder="Course price"
        onChange={(e) => setPriceData(Number(e.target.value))}
      />

      <div>
        {error ? (
          <div className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800">
            <svg
              className="shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="ms-3 text-sm font-medium">{error}</div>
          </div>
        ) : null}
        <div className="w-full flex items-center justify-end">
          <Button disabled={loading} onClick={() => handleSave()}>
            {loading ? "loading..." : courseId ? "Save course" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursePricingForm;
