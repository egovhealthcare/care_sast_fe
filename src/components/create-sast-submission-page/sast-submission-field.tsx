import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldPath, UseFormReturn } from "react-hook-form";

import { CreateSastSubmissionFormValues } from "./schema";

type FormProps = {
  form: UseFormReturn<CreateSastSubmissionFormValues>;
};

type TextFieldProps = FormProps & {
  name: FieldPath<CreateSastSubmissionFormValues>;
  label: string;
  required?: boolean;
  type?: React.ComponentProps<typeof Input>["type"];
  placeholder?: string;
};

export function SastFormTextField({
  form,
  name,
  label,
  required,
  type = "text",
  placeholder,
}: TextFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 text-sm ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value?.toString() ?? ""}
              onChange={(e) => {
                if (type === "number") {
                  const value = e.target.value;
                  field.onChange(value === "" ? undefined : Number(value));
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FileFieldProps = FormProps & {
  name: FieldPath<CreateSastSubmissionFormValues>;
  label: string;
  required?: boolean;
  accept?: string;
};

export function SastFormFileField({
  form,
  name,
  label,
  required,
  accept,
}: FileFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="space-y-1.5">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 text-sm ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file);
              }}
              {...field}
            />
          </FormControl>
          {value instanceof File && (
            <p className="text-xs text-muted-foreground">{value.name}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type SelectFieldProps = FormProps & {
  name: FieldPath<CreateSastSubmissionFormValues>;
  label: string;
  required?: boolean;
  options: readonly string[];
  placeholder?: string;
};

export function SastFormSelectField({
  form,
  name,
  label,
  required,
  options,
  placeholder = "Select",
}: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 text-sm ml-0.5">*</span>}
          </FormLabel>
          <Select value={field.value?.toString()} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type CheckboxFieldProps = FormProps & {
  name: FieldPath<CreateSastSubmissionFormValues>;
  label: string;
};

export function SastFormCheckboxField({ form, name, label }: CheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 space-y-0">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
