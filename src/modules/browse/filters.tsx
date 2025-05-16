import { getAllCategories } from "../admin/category/actions/category.actions";
import CategoryFilter from "./filters/category/category-filter";
import FiltersHeader from "./filters/header";
import PriceFilter from "./filters/price";
import { FiltersQueryType } from "./types";

export default async function ProductFilters({
  queries,
  storeUrl,
}: {
  queries: FiltersQueryType;
  storeUrl?: string;
}) {
  const categories = await getAllCategories();

  return (
    <div className="h-full w-48 transition-transform overflow-auto pr-6 pb-2.5 flex-none basis-[196px] overflow-x-hidden scrollbar">
      <FiltersHeader queries={queries} />
      {/* Filters */}
      <div className="border-t w-40 md:w-44">
        <PriceFilter />
        <CategoryFilter categories={categories} />
      </div>
    </div>
  );
}
