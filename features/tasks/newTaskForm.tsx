"use client";

import { Button } from "@/components/ui/button";

import { Calendar22 } from "../datepicker/page";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ComboboxDemo } from "../combo-box/comboBox";
import { useContext, useState } from "react";
import z, { boolean } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

export function NewTaskForm() {
  const formSchema = z.object({
    status: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    assignedTo: z.string(),
    taskDescription: z.string(),
    taskName: z.string(),
    mileStone: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      status: "",
      startDate: "",
      endDate: "",
      assignedTo: "",
      taskDescription: "",
      taskName: "",
      mileStone: false,
    },
  });

  const [formData, setFormData] = useState({
    assignedTo: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (value: string, name: string) => {
    // 1. Update Local UI State (optional, if you need it outside the form)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 2. Sync with Shadcn Form (react-hook-form)
    // This registers the value in the form's state for submission
    form.setValue(name as keyof z.infer<typeof formSchema>, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="overflow-auto h-[95%]"
    >
      <FieldGroup>
        <div className="flex gap-4 w-full">
          <Calendar22
            name="startDate"
            onChange={(val) => handleChange(val, "startDate")}
          />
          <Calendar22
            name="endDate"
            onChange={(val) => handleChange(val, "endDate")}
          />
        </div>
        <Field>
          <FieldLabel>Assignee</FieldLabel>
          <ComboboxDemo
            name="responsibleAttorney"
            onChange={(val) => handleChange(val, "responsibleAttorney")}
          />
        </Field>
        <Controller
          name="taskName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">
                Task Description
              </FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Task Description"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="taskDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">
                Task Description
              </FieldLabel>
              <Textarea
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Task Description"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field {...field}>
              <FieldLabel>Task Status</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NotStarted">Not Started</SelectItem>
                  <SelectItem value="Inprogess">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="mileStone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field {...field} orientation="horizontal">
              <Checkbox id="finder-pref-9k2-sync-folders-nep" />
              <FieldContent>
                <FieldLabel htmlFor="finder-pref-9k2-sync-folders-nep">
                  Mile Stone
                </FieldLabel>
                {/* <FieldDescription>
                  This task will be used as a check point to indicate how far
                  along the project is.
                </FieldDescription> */}
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}
