import { auth } from "@/auth";
import Header from "@/components/layout/header/header";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import AddToCartButton from "@/modules/cart/components/add-to-cart-btn";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentuser = await auth();
  const user = currentuser?.user;
  const course = await db.course.findUnique({
    where: {
      slug,
    },
    include: {
      users: {
        where: {
          userId: user?.id,
        },
      },
      sections: {
        include: {
          lectures: {
            include: {
              videoLecture: true,
              exerciseLecture: true,
              quizLecture: true,
            },
          },
        },
      },
      language: true,
      instructorProfile: { include: { user: true } },
    },
  });
  if (!course) redirect("/");
  const isEnrolled = course.users.length > 0;
  return (
    <div>
      <Header />
      <section className="text-indigo-200 body-font p-5 bg-gray-900">
        <Link href="" />
        <div className="mx-auto flex px-5  md:flex-row flex-col items-center jobcard">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center">
            <figure className="visible">
              <div>
                <div className="pt-10 px-2 sm:px-6">
                  <span className="inline-block py-1 px-2 rounded-full bg-green-600 text-white  text-xs font-bold tracking-widest mb-2">
                    {course.language?.native}
                  </span>
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-100 capitalize line-clamp-2">
                    {course.title}
                  </h1>
                  <h2 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-gray-100 capitalize line-clamp-2">
                    {course.subtitle}
                  </h2>
                  <p className="text-indigo-200 text-base pb-6">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center pb-12">
                      <div className="h-12 w-12">
                        <Image
                          src={course.instructorProfile.user.image!}
                          width={100}
                          height={100}
                          alt=""
                          className="h-full w-full object-cover overflow-hidden rounded-full"
                        />
                      </div>
                      <p className="text-indigo-200 font-bold ml-3">
                        {course.instructorProfile.user.name} <br />
                        <span className="text-indigo-200 text-sm font-light">
                          4.5 Instructor Rating
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
            <div className="pl-6">
              {isEnrolled ? (
                <Button>Go To Course</Button>
              ) : (
                <div className="flex items-center gap-x-4">
                  <Button>Enroll In Course</Button>
                  <AddToCartButton course={course} />
                </div>
              )}
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 sm:block hidden">
            <img
              className="object-cover object-center rounded"
              alt="course thumbnail"
              src={course.thumbnail!}
            />
          </div>
        </div>
      </section>
      <section>
        <ul className="mt-2 space-y-4 p-5">
          {course.sections.map((section) => (
            <li className="text-left" key={section.id}>
              <label
                htmlFor="accordion-1"
                className="relative flex flex-col rounded-md border border-gray-100 shadow-md"
              >
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="accordion-1"
                  defaultChecked
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-0 top-4 ml-auto mr-5 h-4 text-gray-500 transition peer-checked:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <div className="relative ml-4 cursor-pointer select-none items-center py-4 pr-2">
                  <h3 className="text-base font-bold text-gray-600 lg:text-base">
                    {section.title}
                  </h3>
                </div>
                <div className="max-h-0 overflow-hidden transition-all duration-500 peer-checked:max-h-96">
                  <ul className="space-y-1 font-semibold text-gray-600 mb-6">
                    {section.lectures.map((lecture) => (
                      <li
                        className="flex px-2 sm:px-6 py-2.5 hover:bg-gray-100"
                        key={lecture.id}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="mr-2 w-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {lecture.title}
                        <span className="ml-auto text-sm"> 23 min </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
