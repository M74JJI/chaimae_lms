import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getAllEnrollmentsAction } from "@/modules/admin/enrollments/actions/instructors.actions";

const breadcrumbs = [
  { title: "Enrollments", href: "/" },
  { title: "Manage Enrollments", href: "/dashboard/admin/enrollments" },
];

export default async function AdminDashboardStudentssPage() {
  const enrollments = await getAllEnrollmentsAction();
  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          filterValue="user"
          data={enrollments}
          searchPlaceholder="Search user name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
