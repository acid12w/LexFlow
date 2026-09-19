"use client";

import { Button } from "@/components/ui/button";
import { Calendar22 } from "../datepicker/page";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ComboboxDemo } from "../combo-box/comboBox";
import { useContext, useState } from "react";
import { z } from "zod";
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

import { useCreateTasks } from "@/hooks/task";
import { useParams } from "next/navigation";
import { ModalContext } from "@/components/modal/providers";

const formSchema = z.object({
  matterId: z.string(),
  status: z.string(),
  priority: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  assignedTo: z.array(z.string()),
  description: z.string(),
  title: z.string(),
  mileStone: z.boolean(),
  eventType: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function NewTaskForm() {
  const param = useParams();
  const rawTaskId = param?.taskid;
  const caseId = Array.isArray(rawTaskId)
    ? rawTaskId[0] ?? ""
    : rawTaskId ?? "";

  const modalContext = useContext(ModalContext);
  const setShowTaskModal = modalContext?.setShowTaskModal;

  const initialFormState = {
    assignedTo: [] as string[],
    startDate: "",
    endDate: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      matterId: caseId,
      status: "",
      priority: "",
      startDate: "",
      endDate: "",
      assignedTo: [],
      description: "",
      title: "",
      eventType: "",
      mileStone: false,
    },
  });

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const { mutate: createTask } = useCreateTasks(caseId);

  const handleChange = (value: string, name: keyof FormValues) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    form.setValue(name, value as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAssigneeChange = (assigneeIds: (string | undefined)[]) => {
    const validIds = assigneeIds.filter((id): id is string => id !== undefined);

    setFormData((prev) => ({
      ...prev,
      assignedTo: validIds,
    }));

    form.setValue("assignedTo", validIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      matterId: caseId,
      assignedTo: formData.assignedTo,
    };

    createTask(payload, {
      onSuccess: () => {
        form.reset();
        resetForm();
        setShowTaskModal?.(false);
      },
      onError: (error) => {
        console.error("Mutation Error:", error);
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="overflow-auto h-[95%]"
    >
      <FieldGroup>
        <div className="flex gap-4 w-full">
          <Calendar22
            name="Start date"
            onChange={(val) => handleChange(val, "startDate")}
          />
          <Calendar22
            name="End date"
            onChange={(val) => handleChange(val, "endDate")}
          />
        </div>

        <Field>
          <FieldLabel>Assignee</FieldLabel>
          <ComboboxDemo
            value={formData.assignedTo}
            onChange={handleAssigneeChange}
            placeholder="Select assignees..."
          />
        </Field>

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-title">Task title</FieldLabel>
              <Input
                {...field}
                id="task-title"
                aria-invalid={fieldState.invalid}
                placeholder="Task Title"
                autoComplete="off"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-description">
                Task Description
              </FieldLabel>
              <Textarea
                {...field}
                id="task-description"
                aria-invalid={fieldState.invalid}
                placeholder="Task Description"
                autoComplete="off"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="eventType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="event-type">Event type</FieldLabel>
              <Input
                {...field}
                id="event-type"
                aria-invalid={fieldState.invalid}
                placeholder="Event type"
                autoComplete="off"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Task Status</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Task priority</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="mileStone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="milestone-checkbox"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="milestone-checkbox">Mile Stone</FieldLabel>
              </FieldContent>
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
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
