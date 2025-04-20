import Header from "@/components/layout/dashboard/header/Header";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { getSubcategoriesAction } from "@/modules/admin/category/actions/subcategory.actions";
import { getCategoriesAction } from "@/modules/admin/category/actions/category.actions";
import SubcategoryDetails from "@/modules/admin/category/components/forms/subcategory-details";

const breadcrumbs = [
  { title: "Subcategories", href: "/" },
  {
    title: "Manage Course Subcategories",
    href: "/dashboard/admin/subcategories",
  },
];

//export const dynamic = "force-dynamic";

export default async function AdminDashboardSubCategoriesPage() {
  const subcategories = await getSubcategoriesAction();
  const categories = await getCategoriesAction();
  return (
    <div className="bg-muted/50 ">
      <Header breadcrumbs={breadcrumbs} />
      <div className="h-[calc(100vh-4rem)] p-3 overflow-y-auto">
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Create subcategory
            </>
          }
          modalChildren={<SubcategoryDetails categories={categories.data} />}
          filterValue="name"
          data={subcategories.data}
          searchPlaceholder="Search category name..."
          columns={columns}
        />
      </div>
    </div>
  );
}
