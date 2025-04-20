"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Category } from "@prisma/client";

// Form handling utilities

// Schema
import { CategorySchema } from "@/admin/category/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// Queries
//import { upsertCategory } from "@/queries/category";

// Utils
import { createId } from "@paralleldrive/cuid2";
//import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useFormHandler } from "@/hooks/useFormHandler";
import { upsertCategoryAction } from "../../actions/category.actions";
import FormField from "@/components/ui/form-field";
import { useModal } from "@/providers/modal-provider";

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  // const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  const { setClose } = useModal();

  // Form hook for managing form state and validation
  const { form, message, loading, handleSubmit } = useFormHandler({
    schema: CategorySchema,
    defaultValues: {
      name: "",
      url: "",
    },
    onSubmit: async (values) => {
      const id = createId();
      return await upsertCategoryAction({
        id: data?.id ? data.id : id,
        name: values.name,
        url: values.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
    onSuccess: async () => {
      await new Promise((res) => setTimeout(res, 200)); // slight delay
      setClose();
      router.refresh();
    },
  });

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        url: data?.url,
      });
    }
  }, [data, form]);
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} category information.`
              : " Lets create a category. You can edit category later from the categories table or the category page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                placeholder="Category Name"
                disabled={loading}
              />
              <FormField
                control={form.control}
                name="url"
                placeholder="Category Url"
                disabled={loading}
              />

              <Button type="submit" disabled={loading}>
                {loading
                  ? "loading..."
                  : data?.id
                  ? "Save category information"
                  : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
