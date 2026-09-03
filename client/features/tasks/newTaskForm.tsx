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

import { useCreateTasks } from "@/hooks/task";
import { useTaskStore } from "@/app/store/use-task";
import { useParams } from "next/navigation";
import { ModalContext } from "@/components/modal/providers";

export function NewTaskForm() {
  const param = useParams();
  const caseId = param.taskid;
  const { setShowTaskModal } = useContext(ModalContext);

  const formSchema = z.object({
    matterId: z.string(),
    status: z.string(),
    priority: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    // assignedTo: z.string(),
    description: z.string(),
    title: z.string(),
    mileStone: z.boolean(),
    eventType: z.string(),
  });

  const initialFormState = {
    assignedTo: [] as string[],
    startDate: "",
    endDate: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      matterId: "",
      status: "",
      priority: "",
      startDate: "",
      endDate: "",
      // assignedTo: "",
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

  const { mutate: createTask, isPending, isError } = useCreateTasks(caseId);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value);

    form.setValue(name as keyof z.infer<typeof formSchema>, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAssigneeChange = (assigneeIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: assigneeIds,
    }));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      matterId: caseId,
      assignedTo: formData.assignedTo,
    };

    createTask(payload, {
      onSuccess: () => {
        form.reset();
        resetForm();
        setShowTaskModal(false);
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
              <FieldLabel htmlFor="form-rhf-demo-title">Task title</FieldLabel>
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
          name="description"
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
          name="eventType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Event type</FieldLabel>
              <Input
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                placeholder="Event type"
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
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="IN_REVIEW">In Review</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="priority"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field {...field}>
              <FieldLabel>Task priority</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">low</SelectItem>
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
