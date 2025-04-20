import Header from "@/components/layout/dashboard/header/Header";

const breadcrumbs = [
  { title: "Courses", href: "/" },
  { title: "All Courses", href: "/dashboard" },
];

export default function AdminDashboardAllCoursesPage() {
  return (
    <div>
      <Header breadcrumbs={breadcrumbs} />
    </div>
  );
}
