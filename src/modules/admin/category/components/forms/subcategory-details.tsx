"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Category, Subcategory } from "@prisma/client";

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
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// Queries
//import { upsertCategory } from "@/queries/category";

// Utils
import { createId } from "@paralleldrive/cuid2";
//import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useFormHandler } from "@/hooks/useFormHandler";
import FormField from "@/components/ui/form-field";
import { FormField as FormFieldOriginal } from "@/components/ui/form";
import { useModal } from "@/providers/modal-provider";
import { upsertSubcategoryAction } from "../../actions/subcategory.actions";
import { SubcategorySchema } from "../../schemas/subcategory.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubcategoryDetailsProps {
  data?: Subcategory;
  categories: Category[];
}

const SubcategoryDetails: FC<SubcategoryDetailsProps> = ({
  data,
  categories,
}) => {
  // Initializing necessary hooks
  // const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  const { setClose } = useModal();

  // Form hook for managing form state and validation
  const { form, message, loading, handleSubmit } = useFormHandler({
    schema: SubcategorySchema,
    defaultValues: {
      name: "",
      url: "",
      categoryId: "",
    },
    onSubmit: async (values) => {
      const id = createId();
      return await upsertSubcategoryAction({
        id: data?.id ? data.id : id,
        name: values.name,
        url: values.url,
        categoryId: values.categoryId,
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
    console.log("DATA IN EFFECT:", data);
    if (data) {
      form.reset({
        name: data.name,
        url: data.url,
        categoryId: data.categoryId,
      });
      console.log("AFTER RESET:", form.getValues());
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
                placeholder="Subcategory Name"
                disabled={loading}
              />
              <FormField
                control={form.control}
                name="url"
                placeholder="Subcategory Url"
                disabled={loading}
              />
              <FormFieldOriginal
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || categories.length === 0}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading
                  ? "loading..."
                  : data?.id
                  ? "Save subcategory information"
                  : "Create subcategory"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubcategoryDetails;
