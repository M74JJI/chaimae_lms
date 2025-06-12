import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getAllInstructorsAction } from "@/modules/admin/instructors/actions/instructors.actions";

const breadcrumbs = [
  { title: "Instructors", href: "/" },
  { title: "Manage Instructors", href: "/dashboard/admin/instructors" },
];

export default async function AdminDashboardStudentssPage() {
  const instructors = await getAllInstructorsAction();
  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          filterValue="name"
          data={instructors}
          searchPlaceholder="Search instructor name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
