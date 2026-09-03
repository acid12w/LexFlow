"use client";

import { useEffect } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { GenericCombobox } from "../combo-box/genericComboBox";
import { useCreatetimeTracker } from "@/hooks/useTimeTrackerHook";

export function NewTimeForm({
  currentTime,
  userData,
  onClose,
}: {
  currentTime: string;
  userData: {};
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useCreatetimeTracker();
  // 1. Define schema inside the function so it's clean
  const formSchema = z.object({
    // title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    duration: z.string().min(1, "Duration is required"),
    eventType: z.string().min(1, "Event type is required"),
    user: z.string().optional(),
    matter: z.string().optional(),
    date: z.string().optional(),
  });

  // 2. Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      // title: "New Time Entry", // Default title so it doesn't fail validation
      description: "",
      duration: currentTime || "",
      eventType: "",
      user: "",
      matter: "",
      date: new Date().toISOString(),
    },
  });

  // 3. Sync currentTime prop to the form state
  useEffect(() => {
    if (currentTime) {
      form.setValue("duration", currentTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [currentTime, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutateAsync(values);
      form.reset();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
      className=" h-full w-full"
    >
      <FieldGroup>
        {/* Display the current time at the top for visual feedback */}
        <div className="mb-4 p-2 bg-slate-100 rounded text-center font-mono">
          Duration: {currentTime}
        </div>

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...field}
                placeholder="What did you work on?"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error?.message]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="eventType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Event Type</FieldLabel>
              <Input {...field} placeholder="Event type" autoComplete="off" />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error?.message]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="matter"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Attach this time stamp to a matter</FieldLabel>
              <GenericCombobox
                userData={userData}
                value={field.value}
                onChange={field.onChange}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error?.message]} />
              )}
            </Field>
          )}
        />

        {/* Hidden field so the duration is actually sent with the form */}
        <input type="hidden" {...form.register("duration")} />
      </FieldGroup>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}
