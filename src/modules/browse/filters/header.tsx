"use client";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiltersQueryType } from "../types";

export default function FiltersHeader({
  queries,
}: {
  queries: FiltersQueryType;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [currentParams, setCurrentParams] = useState<string>(
    searchParams.toString()
  );

  useEffect(() => {
    // Update currentParams whenever the searchParams change in the URL
    setCurrentParams(searchParams.toString());
  }, [searchParams]);

  // Destructure queries into an array format
  const queriesArray = Object.entries(queries);
  const queriesLength = queriesArray.reduce((count, [queryKey, queryValue]) => {
    if (queryKey === "sort") return count; // Exclude sort from the count
    if (queryKey === "search" && queryValue === "") return count; // Exclude empty search from count
    return count + (Array.isArray(queryValue) ? queryValue.length : 1); // Count array lengths or single values
  }, 0);

  // Handle Clearing all parameters
  const handleClearQueries = () => {
    const params = new URLSearchParams(searchParams);

    params.forEach((_, key) => {
      params.delete(key);
    });

    // Replace the URL with the pathname and no query string
    replace(pathname);
  };

  // Handle removing specific query values or entire queries
  const handleRemoveQuery = (
    query: string,
    array?: string[],
    specificValue?: string
  ) => {
    const params = new URLSearchParams(searchParams);

    if (specificValue && array) {
      // Remove the specific value from the array and update the params
      const updatedArray = array.filter((value) => value !== specificValue);
      params.delete(query); // Remove the query from params
      // Re-add remaining values if any
      updatedArray.forEach((value) => params.append(query, value));
    } else {
      // Remove the entire query
      params.delete(query);
    }

    // Replace the URL with updated params
    replace(`${pathname}?${params.toString()}`);
    setCurrentParams(params.toString()); // Trigger re-render with updated params
  };
  return (
    <div className="space-y-3 pt-2.5 pb-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Filters ({queriesLength})
        </span>
        {queriesLength > 0 && (
          <button
            onClick={handleClearQueries}
            className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters */}
      <div className="flex flex-wrap gap-2">
        {queriesArray.map(([queryKey, queryValue]) => {
          if (queryKey === "sort") return null;
          if (queryKey === "search" && queryValue === "") return null;

          const isArrayQuery = Array.isArray(queryValue);
          const queryValues = isArrayQuery ? queryValue : [queryValue];

          return queryValues.map((value, index) => (
            <div
              key={`${queryKey}-${index}`}
              className="flex items-center gap-1 px-2 py-1 text-sm rounded-full border bg-card hover:bg-accent transition-colors"
            >
              <span className="max-w-[120px] truncate text-foreground/90">
                {value}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isArrayQuery
                    ? handleRemoveQuery(queryKey, queryValues, value)
                    : handleRemoveQuery(queryKey);
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
