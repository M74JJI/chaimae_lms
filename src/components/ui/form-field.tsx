import {
  FormControl,
  FormField as NativeFormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupSchema } from "@/modules/auth/schemas";
import { Control } from "react-hook-form";
import { z } from "zod";

type SignupSchemaKeys = keyof z.infer<typeof SignupSchema>;

interface CustomFormFieldProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  type?: "text" | "password";
  disabled?: boolean;
  Component?: React.ElementType;
}

const FormField: React.FC<CustomFormFieldProps> = ({
  control,
  name,
  placeholder,
  type = "text",
  disabled,
  Component = Input, // Default to Input but allows any component
}) => {
  return (
    <NativeFormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Component
                {...field}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default FormField;
