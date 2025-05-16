import Header from "@/components/layout/header/header";
import ProductFilters from "@/modules/browse/filters";
import ProductSort from "@/modules/browse/sort";
import { FiltersQueryType } from "@/modules/browse/types";
import { getCourses } from "@/modules/course/actions";
import CourseCard from "@/modules/course/components/card";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<FiltersQueryType>;
}) {
  const queries = await searchParams;

  const { category, search, sort, subCategory, maxPrice, minPrice } = queries;

  const courses_data = await getCourses(
    {
      search,
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
      category,
      subCategory,
    },
    sort,
    1,
    100
  );
  const { courses } = courses_data;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>

      {/* Filters Sidebar */}
      <div className="fixed top-[124px] lg:top-20 left-2 md:left-4 pt-4 h-[calc(100vh-64px)] overflow-auto scrollbar">
        <ProductFilters queries={queries} />
      </div>
      {/* Main Content */}
      <div className="ml-[190px] md:ml-[220px] pt-[140px] lg:pt-24 right-5">
        {/* Sort Section */}
        <div className="sticky top-[64px] z-10 px-4 py-2 flex items-center">
          <ProductSort />
        </div>

        {/* Product List */}
        <div className="mt-2 px-4 w-full overflow-y-auto max-h-[calc(100vh-155px)] pb-28 scrollbar flex flex-wrap">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
