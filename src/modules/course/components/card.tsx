import { Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatCourseDuration } from "../utils";

interface CourseType extends Course {
  category: string;
  subcategory?: string;
  instructor_name: string;
  instructor_image: string;
  numSections: number;
}

export default function CourseCard({ course }: { course: CourseType }) {
  return (
    <Link href={`/course/${course.slug}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        {/* Course Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={course.thumbnail || "/course-placeholder.jpg"}
            alt={course.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.promotionalVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Course Body */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Difficulty */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {course.category}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {course.difficultyLevel}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Course Subtitle */}
          {course.subtitle && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {course.subtitle}
            </p>
          )}

          {/* Instructor Info */}
          <div className="flex items-center mt-auto mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <Image
                src={course.instructor_image || "/instructor-placeholder.jpg"}
                alt={course.instructor_name}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-600">
              {course.instructor_name}
            </span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{course.rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">
                  ({course.numReviews})
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6l4 2"
                  />
                </svg>
                <span>{formatCourseDuration(course.duration)}</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>{course.numLectures} lectures</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            {course.price && course.price > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${course.price.toFixed(2)}
                </span>
                {course.price < 100 && (
                  <span className="ml-2 text-xs line-through text-gray-400">
                    $129.99
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">Free</span>
            )}
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Enroll Now
          </button>
        </div>
      </div>
    </Link>
  );
}
