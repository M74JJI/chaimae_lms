import Header from "@/components/layout/header/header";
import { db } from "@/lib/db";
import { getCourses } from "@/modules/course/actions";
import CourseCard from "@/modules/course/components/card";

export default async function Home() {
  const courses_data = await getCourses({}, "", 1, 100);
  const { courses } = courses_data;
  return (
    <>
      <Header />
      <div className="p-4 flex flex-wrap gap-8">
        {courses.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </div>
    </>
  );
}
