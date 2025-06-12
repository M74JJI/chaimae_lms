"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryLink from "./category-link";
import { CatgegoryWithSubsType } from "@/modules/admin/category/types";

export default function CategoryFilter({
  categories,
}: {
  categories: CatgegoryWithSubsType[];
}) {
  const [show, setShow] = useState<boolean>(true);
  return (
    <div className="py-4 border-b border-border/50">
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setShow((prev) => !prev)}
      >
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          Category
        </h3>
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {show ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </div>

      <div className={cn("mt-3 space-y-2", { hidden: !show })}>
        {categories.map((category) => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
