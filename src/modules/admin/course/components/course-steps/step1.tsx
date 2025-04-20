import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
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
import {
  CourseCreateSchemaType,
  CourseTitleSchema,
} from "../../schemas/course.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormData {
  title: string;
}

export default function Step1({
  step,
  setStep,
  formData,
  setFormData,
}: {
  formData: CourseCreateSchemaType;
  setFormData: Dispatch<SetStateAction<CourseCreateSchemaType>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CourseTitleSchema>>({
    mode: "onChange", // Form validation mode
    resolver: zodResolver(CourseTitleSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      title: formData.title,
    },
  });

  // Get product details that are needed to add review info
  const handleSubmit = async (values: z.infer<typeof CourseTitleSchema>) => {
    setStep((prev) => prev + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    form.setValue(name as keyof FormData, value);
  };

  return (
    <div className="h-full w-full flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="min-w-xl space-y-10 mt-16"
        >
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold">Got a Title in Mind?</h1>
            <h2>(No worries, you can always change it later.)</h2>
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <Input
                    placeholder="Course title"
                    value={field.value}
                    type="text"
                    name="title"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormMessage className="ml-1" />
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
        <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
