"use client";

// React
import { FC, useEffect, useState } from "react";

// Prisma model
import { Category, Course, Language, Subcategory } from "@prisma/client";

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
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
//import { upsertSubcategoryAction } from "../../actions/subcategory.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseSchema } from "../../schemas/course.schema";
import { upsertCourseAction } from "../../actions/course.actions";
import ClickToAddInputs from "@/components/dashboard/shared/click-to-add";
import {
  getSubcategoriesAction,
  getSubcategoriesInCategoryAction,
} from "@/modules/admin/category/actions/subcategory.actions";
import MediaUpload from "@/components/dashboard/shared/file-upload";

interface CourseDetailsProps {
  data?: Course;
  languages: Language[];
  categories: Category[];
}

const CourseDetails: FC<CourseDetailsProps> = ({
  data,
  languages,
  categories,
}) => {
  // Initializing necessary hooks
  // const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing
  const { setClose } = useModal();

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Form hook for managing form state and validation
  const { form, message, loading, handleSubmit } = useFormHandler({
    schema: CourseSchema,
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      price: 0,
      thumbnail: "",
      promotionalVideo: "",
      status: "DRAFT",
      difficultyLevel: "BEGINNER",
      intendedLearners: [],
      prerequisites: [],
      objectives: [],
      categoryId: "",
      subcategoryId: "cm9j5powp0002pi28h0vac4zc",
      languageId: "",
    },
    onSubmit: async (values) => {
      const id = createId();
      return await upsertCourseAction({
        id: data?.id ? data.id : id,
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        slug: "",
        price: values.price,
        thumbnail: values.thumbnail,
        promotionalVideo: values.promotionalVideo || "aaaaaaaaaa",
        status: "DRAFT",
        difficultyLevel: "BEGINNER",
        intendedLearners: values.intendedLearners,
        prerequisites: values.prerequisites,
        objectives: values.objectives,
        instructorProfileId: "",
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        languageId: values.languageId,
        duration: null,
        welcomeMessage: null,
        congratulationsMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    },
  });
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getSubcategoriesInCategoryAction(
        form.watch().categoryId
      );
      setSubcategories(res.data);
    };
    getSubCategories();
  }, [form.watch().categoryId]);
  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset(data);
      /*
      form.reset({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        thumbnail: data.thumbnail,
        promotionalVideo: data.promotionalVideo,
        status: data.status,
        difficultyLevel: data.difficultyLevel,
        intendedLearners: data.intendedLearners,
        prerequisites: data.prerequisites,
        objectives: data.objectives,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        languageId: data.languageId,
      });
 */
    }
  }, [data, form]);

  const [intendedLearners, setIntendedLearners] = useState<string[]>(
    data?.intendedLearners || []
  );
  const [prerequisites, setPrerequisites] = useState<string[]>(
    data?.prerequisites || []
  );
  const [objectives, setObjectives] = useState<string[]>(
    data?.objectives || []
  );

  // Whenever intendedLearners, changes we update the form values
  useEffect(() => {
    form.setValue("intendedLearners", intendedLearners);
    form.setValue("prerequisites", prerequisites);
    form.setValue("objectives", objectives);
  }, [intendedLearners, prerequisites, objectives]);
  console.log("*---->", form.formState.errors);
  console.log(subcategories);
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.title} course information.`
              : " Lets create a course. You can edit course later from the categories table or the course page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormFieldOriginal
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem className="w-full xl:border-r">
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <MediaUpload
                        value={field.value}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={(url) => field.onChange(field.value === url)}
                      />
                    </FormControl>
                    <FormMessage className="!mt-4" />
                  </FormItem>
                )}
              />
              <FormFieldOriginal
                control={form.control}
                name="promotionalVideo"
                render={({ field }) => (
                  <FormItem className="w-full xl:border-r">
                    <FormLabel>Promotional Video</FormLabel>
                    <FormControl>
                      <MediaUpload
                        value={field.value}
                        disabled={loading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={(url) => field.onChange(field.value === url)}
                      />
                    </FormControl>
                    <FormMessage className="!mt-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                placeholder="course title"
                disabled={loading}
              />
              <FormField
                control={form.control}
                name="subtitle"
                placeholder="course subtitle"
                disabled={loading}
              />
              <FormField
                control={form.control}
                name="description"
                placeholder="course description"
                disabled={loading}
              />
              <ClickToAddInputs
                details={data?.intendedLearners || intendedLearners}
                setDetails={setIntendedLearners}
                header="Intended Learners"
                minInputs={1}
              />
              <ClickToAddInputs
                details={data?.prerequisites || prerequisites}
                setDetails={setPrerequisites}
                header="Prerequisites"
                minInputs={1}
              />
              <ClickToAddInputs
                details={data?.objectives || objectives}
                setDetails={setObjectives}
                header="Objectives"
                minInputs={1}
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
              <FormFieldOriginal
                control={form.control}
                name="subcategoryId"
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
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.id}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormFieldOriginal
                control={form.control}
                name="languageId"
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
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
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
                  ? "Save course information"
                  : "Create course"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CourseDetails;
