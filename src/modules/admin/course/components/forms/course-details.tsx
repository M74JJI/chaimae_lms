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
import {
  CourseCreateSchemaType,
  CourseSchema,
} from "../../schemas/course.schema";
import { upsertCourseAction } from "../../actions/course.actions";
import ClickToAddInputs from "@/components/dashboard/shared/click-to-add";
import {
  getSubcategoriesAction,
  getSubcategoriesInCategoryAction,
} from "@/modules/admin/category/actions/subcategory.actions";
import MediaUpload from "@/components/dashboard/shared/file-upload";
import { CourseDataType } from "../../types";
import ProgressBar from "../progress-bar";
import Step1 from "../course-steps/step1";
import Step2 from "../course-steps/step2";

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
  const [step, setStep] = useState<number>(1);

  const [courseData, setCourseData] = useState<CourseCreateSchemaType>({
    title: "",
    categoryId: "",
  });
  return (
    <div className="space-y-5">
      <ProgressBar step={step} />
      {/* Steps */}
      {step === 1 ? (
        <Step1
          step={step}
          setStep={setStep}
          formData={courseData}
          setFormData={setCourseData}
        />
      ) : step === 2 ? (
        <Step2
          step={step}
          setStep={setStep}
          formData={courseData}
          setFormData={setCourseData}
          categories={categories}
        />
      ) : null}
    </div>
  );
};

export default CourseDetails;
