import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { getAllCoursesForAdminAction } from "@/modules/admin/course/actions/course.actions";
import { columns } from "./columns";

const breadcrumbs = [
  { title: "Courses", href: "/" },
  { title: "All Courses", href: "/dashboard" },
];

export default async function AdminDashboardAllCoursesPage() {
  const courses = await getAllCoursesForAdminAction();

  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          filterValue="title"
          data={courses}
          searchPlaceholder="Search course name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
