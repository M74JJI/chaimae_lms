import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getAllStudentsAction } from "@/modules/admin/students/actions/students.actions";

const breadcrumbs = [
  { title: "Students", href: "/" },
  { title: "Manage Students", href: "/dashboard/admin/students" },
];

export default async function AdminDashboardStudentssPage() {
  const students = await getAllStudentsAction();
  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          filterValue="name"
          data={students}
          searchPlaceholder="Search student name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
