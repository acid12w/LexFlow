"use client";
import React from "react";
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
import { cn } from "@/lib/utils";
import { AvatarGroup } from "../avatar/avatar";
import { useUserCredentials } from "@/app/store/user-store";
import { RiUserAddLine } from "react-icons/ri";
import { GrStatusInfo } from "react-icons/gr";
import {
  CalendarDays,
  UserRound,
  Flag,
  SquareCheckBig,
  ClipboardMinus,
} from "lucide-react";

export function EditTaskForm({ isEditing }) {
  const formSchema = z.object({
    status: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    assignedTo: z.array(z.string()),
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
      assignedTo: [],
      taskDescription: "",
      taskName: "",
      mileStone: false,
    },
  });

  const [formData, setFormData] = useState({
    assignedTo: [] as string[],
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
  const [open, setOpen] = React.useState(false);
  const firmMembers = useUserCredentials((state) => state.members);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  const avatarFormData = firmMembers.filter((member) =>
    assigneeIds.includes(member._id)
  );

  const handleAssigneeChange = (ids: string[]) => {
    setAssigneeIds(ids);
    setFormData((prev) => ({ ...prev, assignedTo: ids }));
    form.setValue("assignedTo", ids, { shouldValidate: true, shouldDirty: true });
    setOpen(false);
  };

  return (
    <div>
      {isEditing ? (
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
                value={formData.assignedTo}
                onChange={handleAssigneeChange}
                placeholder="Select assignees..."
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
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
      ) : (
        <div
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center justify-center">
              <GrStatusInfo size={20} />
              <p>Status</p>
            </div>

            <p
              className={cn(
                "bg-[#d9fcf4] text-[#03a24e] font-medium px-2 py-1 rounded-sm flex items-center gap-x-2",
                {
                  "bg-[#d9fcf4] text-[#03a24e]": status === "complete",
                  "bg-[#E2F1FF] text-[#006bc9]": status === "inprogress",
                  "bg-[#fff4d3] text-[#e49101]": status === "not started",
                }
              )}
            >
              Inprogress
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center justify-center">
              <CalendarDays size={20} />
              <p className="w-max">Due Date</p>
            </div>
            <p className="">24 may 2025</p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <UserRound size={20} />
              <p>Assignee</p>
            </div>

            <div className="flex gap-4 relative">
              <AvatarGroup userData={avatarFormData} />
              {open && (
                <ComboboxDemo
                  value={assigneeIds}
                  onChange={handleAssigneeChange}
                  placeholder="Select assignees..."
                />
              )}
              <Button
                type="button"
                onClick={() => setOpen(!open)}
                size="icon"
                className="rounded-full bg-blue-400 outline-blue-800 outline-dashed"
              >
                <RiUserAddLine className="fill-blue-800" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Flag size={20} />
              <p>Priority</p>
            </div>
            <p
              className={cn(
                " bg-[#E2F1FF] text-[#006bc9] font-medium px-2 py-1 rounded-sm flex items-center gap-x-2",
                {
                  "bg-[#d9fcf4] text-[#03a24e]": status === "complete",
                  "bg-[#E2F1FF] text-[#006bc9]": status === "inprogress",
                  "bg-[#fff4d3] text-[#e49101]": status === "not started",
                }
              )}
            >
              High
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <SquareCheckBig size={20} />
              <p>Event Type</p>
            </div>
            <p className="bg-[#fff4d3] text-[#e49101] rounded-sm px-3 py-1">
              Court
            </p>
          </div>
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardMinus size={20} />
              <p>Description</p>
            </div>
            <p className="text-sm ml-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
              corporis atque temporibus aspernatur sed esse non. Tenetur
              deserunt officiis provident,
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
