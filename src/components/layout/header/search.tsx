"use client";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { push, replace } = useRouter();

  const search_query_url = params.get("search");

  const [searchQuery, setSearchQuery] = useState<string>(
    search_query_url || ""
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (pathname !== "/browse") {
      // We are not in browse page
      push(`/browse?search=${searchQuery}`);
    } else {
      // We are in browse page
      if (!searchQuery) {
        params.delete("search");
      } else {
        params.set("search", searchQuery);
      }
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (pathname === "/browse") return;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex-1 px-8 ">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent outline-none placeholder:text-colorBlackPearl/55"
          value={searchQuery}
          onChange={handleInputChange}
        />

        <div className="absolute top-1/2 -translate-y-1/2 right-2">
          <button className="flex gap-x-1 items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white  py-2.5 px-6 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse  cursor-pointer">
            Search
            <SearchIcon className="w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
