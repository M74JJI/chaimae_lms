"use client";

// React
import { FC, useEffect, useState } from "react";

// Prisma model

// Form handling utilities

// UI Components

import { Button } from "@/components/ui/button";
// Queries

// Utils
import { createId } from "@paralleldrive/cuid2";

import { CourseSchemaType } from "../../schemas/course.schema";
import { updateCourseAction } from "../../actions/course.actions";
import { useRouter } from "next/navigation";
import ClickToAddInputs from "@/components/dashboard/shared/click-to-add";
import { CourseLandingType, DifficultyLevels } from "../../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Category, Language, Subcategory } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaUpload from "@/components/dashboard/shared/file-upload";

interface LandingProps {
  courseId: string;
  data: CourseLandingType;
  languages: Language[];
  categories: Category[];
  subcategories: Subcategory[];
}

const CourseLandingForm: FC<LandingProps> = ({
  data,
  courseId,
  languages,
  categories,
  subcategories,
}) => {
  const router = useRouter();
  const [landingData, setLandingData] = useState<CourseLandingType>(data);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleInputChange = (key: keyof CourseLandingType, value: string) => {
    setLandingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await updateCourseAction(courseId, landingData);

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
        <div className="mx-auto sm:container">
          <div className="border-stroke dark:border-dark-3 border-b">
            <h2 className="text-dark mb-2 text-2xl font-semibold dark:text-white">
              Course landing page
            </h2>
            <p className="text-body-color dark:text-dark-6 mb-6 text-sm font-medium">
              Your course landing page plays a key role in attracting students
              and boosting your visibility on platforms like Google. A
              well-crafted page clearly highlights the value of your course and
              encourages potential learners to enroll. Use this section to
              create a compelling introduction that showcases why your course
              stands out. For best practices, review our guide on writing
              effective course titles and landing pages.
            </p>
          </div>
        </div>
      </div>
      <Input
        value={landingData.title}
        placeholder="Course title"
        onChange={(e) => handleInputChange("title", e.target.value)}
      />
      <Input
        value={landingData.subtitle}
        placeholder="Course subtitle"
        onChange={(e) => handleInputChange("subtitle", e.target.value)}
      />
      <Textarea
        value={landingData.description}
        placeholder="Course description"
        onChange={(e) => handleInputChange("description", e.target.value)}
      />
      <div className="grid grid-cols-3 gap-4">
        <Select
          onValueChange={(value) => handleInputChange("languageId", value)}
          value={landingData.languageId}
          disabled={loading}
          defaultValue={landingData.languageId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                {lang.name} - {lang.native}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleInputChange("categoryId", value)}
          value={landingData.categoryId}
          disabled
          defaultValue={landingData.categoryId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleInputChange("subcategoryId", value)}
          value={landingData.subcategoryId}
          disabled={loading}
          defaultValue={landingData.subcategoryId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.id}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full pl-8 flex justify-end">
        <Select
          onValueChange={(value) => handleInputChange("difficultyLevel", value)}
          value={landingData.difficultyLevel}
          disabled={loading}
          defaultValue={landingData.difficultyLevel}
        >
          <SelectTrigger className="w-1/3 ">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            {DifficultyLevels.map((lvl) => (
              <SelectItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-4">
        <MediaUpload
          value={landingData.thumbnail || ""}
          disabled={loading}
          onChange={(url) => handleInputChange("thumbnail", url)}
          onRemove={(url) => handleInputChange("thumbnail", "")}
          title="Course Image"
          description="Upload a high-quality image that clearly represents your course. Make sure the image is sharp, visually appealing, and free of text, logos, or promotional elements."
        />
        <MediaUpload
          value={landingData.promotionalVideo || ""}
          disabled={loading}
          onChange={(url) => handleInputChange("promotionalVideo", url)}
          onRemove={(url) => handleInputChange("promotionalVideo", "")}
          title="Promotional video"
          description="Your promo video is a powerful introduction to your course. It gives potential students a quick and engaging overview of what they can expect to learn. A clear and well-crafted promo video can significantly increase enrollment by showcasing the value of your course."
        />
      </div>
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

export default CourseLandingForm;
