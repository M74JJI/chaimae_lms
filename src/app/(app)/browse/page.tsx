import Header from "@/components/layout/header/header";
import ProductFilters from "@/modules/browse/filters";
import ProductSort from "@/modules/browse/sort";
import { FiltersQueryType } from "@/modules/browse/types";
import { getCourses } from "@/modules/course/actions";
import { CourseCard } from "@/modules/home/components/course-card";

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
    <div className="relative min-h-screen bg-blue-50/20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="pt-24 pb-12 container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Browse All Courses
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover the perfect course for your learning journey
          </p>
        </div>

        <div className="flex lg:flex-row gap-8">
          {/* Filters Sidebar - Styled to match theme */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 h-[calc(100vh-140px)] overflow-auto scrollbar pr-2">
              <div className="bg-white rounded-xl border border-gray-200/60 p-6 shadow-sm">
                <h2 className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-4">
                  Filter Courses
                </h2>
                <ProductFilters queries={queries} />
              </div>
            </div>
          </div>

          {/* Course Listing Area */}
          <div className="flex-1">
            {/* Sort Controls - Styled to match theme */}
            <div className="mb-6 bg-white rounded-xl border border-gray-200/60 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {courses.length} courses found
                </span>
                <ProductSort />
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
