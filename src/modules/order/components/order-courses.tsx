import { OrderItem } from "@prisma/client";
import Image from "next/image";

export default function OrderCourses({ courses }: { courses: OrderItem[] }) {
  return (
    <div className="order-area-courses min-[768px]:h-[calc(100vh-137px)] overflow-y-auto scrollbar px-4">
      {courses.map((course) => (
        <div
          className="md:flex items-center py-8 border-t border-b border-gray-200"
          key={course.id}
        >
          <div className="h-full w-1/2">
            <Image
              src={course.thumbnail}
              alt=""
              width={300}
              height={200}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="md:pl-3 md:w-3/4 w-full">
            <div className="flex items-center justify-between w-full pt-1">
              <p className="text-base font-black leading-none text-gray-800 line-clamp-1 capitalize">
                {course.title}
              </p>
              <select className="px-1 border pt-1 border-gray-200 mr-6 focus:outline-none">
                <option>01</option>
              </select>
            </div>
            <p className="text-xs leading-3 text-gray-600 line-clamp-2"></p>
            <div className="mt-2 flex items-center">
              {/*
                            <StarRatings
                              rating={course.course.rating}
                              starRatedColor="#FFD700"
                              numberOfStars={5}
                              starSpacing="1"
                              starDimension="15px"
                            />
                           */}
              {/*
              <p className="text-xs mt-1 text-gray-500">
                ({course.course.numReviews}&nbsp;
                {course.course.numReviews > 1 ? "ratings" : "rating"} )
              </p>
              */}
            </div>

            {/*
            <div className="mt-2 flex items-center flex-wrap gap-1 text-gray-400 text-xs">
              <p>{formatCourseDuration(course.course.duration)} total</p>●
              <p>{course.course.numLectures} lectures</p>●
              <p>{course.course.difficultyLevel}</p>
            </div>
           */}
            {/*
            <p className="w-96 text-xs leading-3 text-gray-600 pt-3">
              By: {course.course.instructorProfile.user.name}
            </p>
            */}
            <div className="flex items-center justify-between pt-5 pr-6">
              <p className="text-base font-black leading-none text-gray-800">
                ${course.price?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
