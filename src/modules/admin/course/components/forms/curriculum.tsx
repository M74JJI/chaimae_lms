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
import { CourseSectionType } from "../../types";
import { SectionManager } from "../curriculum-manager";
import { Lecture, Section } from "@prisma/client";

interface ObjectivesProps {
  courseId: string;
  data: CourseSectionType[];
}

const CourseCurriculumForm: FC<ObjectivesProps> = ({ data, courseId }) => {
  const router = useRouter();
  const [sections, setSections] = useState<CourseSectionType[]>(data);
  const [deletedSections, setDeletedSections] = useState<{ id: string }[]>([]);
  const [deletedLectures, setDeletedLectures] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await updateCourseAction(courseId, {
        sections,
        deletedLectures,
        deletedSections,
      });

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

  console.log("------->", sections);

  return (
    <div className="space-y-4">
      <div>
        <div className="mx-auto px-4 sm:container">
          <div className="border-stroke dark:border-dark-3 border-b">
            <h2 className="text-dark mb-2 text-2xl font-semibold dark:text-white">
              Curriculum
            </h2>
            <p className="text-body-color dark:text-dark-6 mb-6 text-sm font-medium">
              Explore the complete structure of your course through this
              curriculum. Each section is designed to guide learners step by
              step, ensuring they build knowledge progressively and master each
              topic with confidence. A well-organized curriculum sets the
              foundation for an effective and engaging learning experience.
            </p>
          </div>
        </div>
      </div>
      <SectionManager
        courseId={courseId}
        sections={sections}
        setSections={setSections}
        handleSave={handleSave}
        loading={loading}
        deletedSections={deletedSections}
        setDeletedSections={setDeletedSections}
        deletedLectures={deletedLectures}
        setDeletedLectures={setDeletedLectures}
      />
      <div className="px-4">
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

export default CourseCurriculumForm;
