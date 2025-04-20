import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import CategoryDetails from "@/modules/admin/category/components/forms/category-details";
import { getCategoriesAction } from "@/modules/admin/category/actions/category.actions";

const breadcrumbs = [
  { title: "Categories", href: "/" },
  { title: "Manage Course Categories", href: "/dashboard/admin/categories" },
];

//export const dynamic = "force-dynamic";

export default async function AdminDashboardCategoriesPage() {
  const categories = await getCategoriesAction();
  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create category
            </>
          }
          modalChildren={<CategoryDetails />}
          filterValue="name"
          data={categories.data}
          searchPlaceholder="Search category name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
