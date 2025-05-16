import React from "react";
import { CourseCartType } from "../types";
import Image from "next/image";

export default function CourseCartCard({ course }: { course: CourseCartType }) {
  return (
    <div className="w-full border-t">
      <div className="py-3">
        <div className="flex gap-x-4">
          <div>
            <Image
              src={course.thumbnail}
              alt="thumbnail"
              width={150}
              height={150}
              className="w-40 h-30 object-center object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold capitalize line-clamp-1">
              {course.title}
            </h1>
            <h3 className="text-gray-600">By {course.instructor}</h3>
          </div>
          <div className="text-2xl font-bold">{course.price}$</div>
        </div>
      </div>
    </div>
  );
}
