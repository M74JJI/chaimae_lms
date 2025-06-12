"use client";
import { FC, useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const PriceFilter: FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState<string | number>(""); // Initial value as empty string
  const [maxPrice, setMaxPrice] = useState<string | number>("");

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Update URL params
  const updateUrlParams = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) {
      params.set("minPrice", String(minPrice));
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", String(maxPrice));
    } else {
      params.delete("maxPrice");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  // Handle minPrice change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  // Handle maxPrice change
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  // Use effect to handle debounce of the URL update
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      updateUrlParams();
    }, 500); // Debouncing for 500ms delay

    setDebounceTimeout(timeout);

    // Cleanup the timeout when the component unmounts or changes
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [minPrice, maxPrice]);

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-sm font-medium text-foreground">Price range</h3>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            name="minPrice"
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            placeholder="Min"
            min={0}
            className="w-full p-2 text-sm border rounded bg-background "
          />
        </div>
        <span className="text-muted-foreground">–</span>
        <div className="relative flex-1">
          <input
            name="maxPrice"
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            placeholder="Max"
            max={999999}
            className="w-full p-2 text-sm border rounded bg-background "
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
