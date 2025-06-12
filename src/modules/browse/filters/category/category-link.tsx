import { cn } from "@/lib/utils";
import { CatgegoryWithSubsType } from "@/modules/admin/category/types";
import { Minus, Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CategoryLink({
  category,
}: {
  category: CatgegoryWithSubsType;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const categoryQuery = searchParams.get("category");
  const subCategoryQuery = searchParams.get("subCategory");
  const [expand, setExpand] = useState<boolean>(false);

  const handleCategoryChange = (category: string) => {
    if (category === categoryQuery) return;
    params.delete("subCategory");
    params.set("category", category);
    replaceParams();
  };

  const handleSubCategoryChange = (sub: string) => {
    if (category.url !== categoryQuery) params.set("category", category.url);
    if (sub === subCategoryQuery) {
      params.delete("subCategory");
    } else {
      params.set("subCategory", sub);
    }
    replaceParams();
  };

  const replaceParams = () => {
    replace(`${pathname}?${params.toString()}`);
    setExpand(true);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={category.id}
          className="flex items-center gap-2 cursor-pointer w-full py-1 group"
          onClick={() => handleCategoryChange(category.url)}
        >
          <span
            className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
              category.url === categoryQuery
                ? "border-primary bg-primary"
                : "border-border group-hover:border-primary/50"
            )}
          >
            {category.url === categoryQuery && (
              <div className="w-2 h-2 rounded-full bg-background" />
            )}
          </span>
          <span className="text-sm text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </span>
        </label>

        {category.subcategories.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpand(!expand);
            }}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {expand ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {expand && category.subcategories.length > 0 && (
        <div className="ml-6 space-y-1.5">
          {category.subcategories.map((sub) => (
            <label
              key={sub.id}
              htmlFor={sub.id}
              className="flex items-center gap-2 cursor-pointer py-1 group"
              onClick={() => handleSubCategoryChange(sub.url)}
            >
              <span
                className={cn(
                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors",
                  sub.url === subCategoryQuery
                    ? "border-primary bg-primary"
                    : "border-border group-hover:border-primary/50"
                )}
              >
                {sub.url === subCategoryQuery && (
                  <div className="w-1.5 h-1.5 rounded-full bg-background" />
                )}
              </span>
              <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">
                {sub.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
