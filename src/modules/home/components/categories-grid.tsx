import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function CategoriesGrid({ categories }: { categories: any[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`}>
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="h-12 w-12 mb-3 relative">
                <Image
                  src={category.image || "/category-placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category._count?.courses || 0} courses
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
