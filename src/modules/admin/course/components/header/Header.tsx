import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CourseStatusType } from "../../types";
import { Button } from "@/components/ui/button";

export default function CourseHeader({
  title,
  status,
  duration,
}: {
  title: string;
  status: CourseStatusType;
  duration: number | null;
}) {
  return (
    <header className="sticky top-0 w-full h-14 z-50 bg-background flex items-center shadow-sm ">
      <div className="w-full py-2 px-4 flex items-center justify-between ">
        {/* left */}
        <div className="flex items-center gap-x-4">
          <Link href="/dashboard/instructor/courses">
            <div className="flex items-center text-xs hover:underline cursor-pointer">
              <ChevronLeft className="w-4" /> Back to courses
            </div>
          </Link>
          <div>
            <h1>{title}</h1>
          </div>
          <div>
            <div className="bg-gray-200 dark:bg-[#9194ac] p-1.5 rounded-md text-xs font-bold">
              {status}
            </div>
          </div>
          <div>
            <p className="text-xs">
              {duration || 0}min of video content uploaded
            </p>
          </div>
        </div>
        {/* right */}
        <div className="space-x-3">
          <Button className="h-7" variant="secondary">
            Preview
          </Button>
        </div>
      </div>
    </header>
  );
}
