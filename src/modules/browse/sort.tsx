"use client";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sortOptions = [
  {
    name: "Most Popular",
    query: "most-popular",
    icon: "🔥",
  },
  {
    name: "New Arrivals",
    query: "new-arrivals",
    icon: "🆕",
  },
  {
    name: "Top Rated",
    query: "top-rated",
    icon: "⭐",
  },
  {
    name: "Price: Low to High",
    query: "price-low-to-high",
    icon: "↗️",
  },
  {
    name: "Price: High to Low",
    query: "price-high-to-low",
    icon: "↘️",
  },
];

export default function ProductSort() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const sortQuery = params.get("sort") || "most-popular";
  const currentSort =
    sortOptions.find((s) => s.query === sortQuery) || sortOptions[0];
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (sort: string) => {
    params.set("sort", sort);
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Sort Dropdown Trigger */}
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white",
          "hover:border-blue-300 hover:shadow-sm transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400",
          isOpen && "border-blue-400 shadow-sm ring-2 ring-blue-100"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
        <span className="font-medium text-gray-800 flex items-center gap-1">
          {currentSort.icon && (
            <span className="text-sm opacity-80">{currentSort.icon}</span>
          )}
          {currentSort.name}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute top-full right-0 mt-2 w-56 rounded-xl bg-white shadow-lg",
          "border border-gray-100 overflow-hidden z-50 transition-all duration-200",
          "origin-top-right transform-gpu",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.query}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 text-sm",
                "hover:bg-blue-50/50 transition-colors duration-150",
                option.query === sortQuery && "bg-blue-50 text-blue-600"
              )}
              onClick={() => handleSort(option.query)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-80">{option.icon}</span>
                <span>{option.name}</span>
              </div>
              {option.query === sortQuery && (
                <Check className="w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
