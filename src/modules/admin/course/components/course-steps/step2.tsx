import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CourseDataType } from "../../types";
import {
  CourseCategorySchema,
  CourseCreateSchemaType,
} from "../../schemas/course.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField as FormFieldOriginal } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { createCourseAction } from "../../actions/course.actions";
import BeatLoader from "react-spinners/BeatLoader";
import { redirect } from "next/navigation";

interface FormData {
  categoryId: string;
}

export default function Step2({
  step,
  setStep,
  formData,
  setFormData,
  categories,
}: {
  formData: CourseCreateSchemaType;
  setFormData: Dispatch<SetStateAction<CourseCreateSchemaType>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  categories: Category[];
}) {
  // Loading state
  const [loading, setLoading] = useState(false);
  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CourseCategorySchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(CourseCategorySchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      categoryId: formData.categoryId,
    },
  });

  // Get product details that are needed to add review info
  const handleSubmit = async (values: z.infer<typeof CourseCategorySchema>) => {
    setLoading(true);
    const res = await createCourseAction(formData);
    if (res.success)
      redirect(
        `/dashboard/instructor/courses/${res.data?.id}/manage/intended-learners`
      );
    setLoading(false);
  };
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
    form.setValue("categoryId", value);
  };
  return (
    <div className="h-full w-full flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="min-w-xl space-y-10 mt-16"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">
              Which Category Matches Your Course?
            </h1>
            <h2>(You can always update this later.)</h2>
          </div>

          <FormFieldOriginal
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={handleSelectChange}
                    value={field.value}
                    disabled={categories.length === 0}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
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
        </form>
      </Form>
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-between p-4">
        <Button
          variant={"secondary"}
          type="button"
          onClick={() => step > 1 && setStep((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Button
          className="w-20"
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
        >
          {loading ? <BeatLoader size={10} color="#fff" /> : "Create"}
        </Button>
      </div>
    </div>
  );
}
