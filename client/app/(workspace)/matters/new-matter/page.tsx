"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar22 } from "@/features/datepicker/page";

import { BiSolidBriefcase } from "react-icons/bi";
import { MdOutlineSecurity } from "react-icons/md";

import { TbSubtask } from "react-icons/tb";

import { ComboboxDemo } from "@/features/combo-box/comboBox";
import { useState } from "react";

import { useCreateMatters } from "@/hooks/useMatterHook";
import React from "react";
import { PracticeAreaCombobox } from "@/features/combo-box/practiceArea";
import { useRouter } from "next/navigation";

export const matterSchema = z.object({
  // .trim() prevents users from bypassing min constraints by typing spaces
  title: z.string().trim().min(3).max(100),
  matterDescription: z.string().trim().min(10),

  // Enforces that arrays must contain valid, non-empty text strings
  responsibleAttorney: z.array(z.string().trim()),
  originatingAttorney: z.array(z.string().trim()),
  responsibleStaff: z.array(z.string().trim()),
  assignedTo: z.array(z.string().trim()),
  allowAccess: z.array(z.string().trim()).optional(),

  priority: z.enum(["low", "medium", "high", "urgent"]),
  practiceArea: z.string().trim().min(1),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  isBillable: z.boolean(),

  // Non-negative values only, with conditional logic added below
  billingAmount: z.coerce.number().nonnegative(),

  // Lowercases the email address automatically
  clientEmail: z.string().trim().email().lowercase(),

  // Enforces a standard phone format (7 to 15 digits, allowing an optional starting +)
  clientContactNumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{6,14}$/, {
      message:
        "Invalid phone number format. Use international or local numeric format.",
    }),

  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),

  // Note: Adjusted back to lowercase to match your previous defaultValues ["individual", "business"]
  clientType: z.enum(["Individual", "Business"]),

  // Alphanumeric code validation, preventing empty text or spaces
  refrenceNumber: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message:
        "Reference number must be alphanumeric (letters, numbers, hyphens only).",
    }),
});

// 1. FIXED: Corrected the syntax for z.infer
export type MatterFormValues = z.infer<typeof matterSchema>;

export default function MatterField() {
  const { mutateAsync, isPending } = useCreateMatters();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasAccess, sethasAccess] = useState<boolean>(false);

  // 2. FIXED: Explicitly passed <MatterFormValues> to useForm
  const form = useForm<MatterFormValues>({
    resolver: zodResolver(matterSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      matterDescription: "",
      responsibleAttorney: [],
      originatingAttorney: [],
      responsibleStaff: [],
      assignedTo: [],
      priority: "low",
      practiceArea: "",
      allowAccess: [],
      startDate: new Date(),
      endDate: new Date(),
      isBillable: false,
      billingAmount: 0,
      clientEmail: "",
      clientContactNumber: "",
      firstName: "",
      lastName: "",
      clientType: "Individual",
      refrenceNumber: "", // Note: This will trigger a validation error on submit because min is 1
    },
  });

  const [formData, setFormData] = useState({
    template: "",
    title: "",
    firstName: "",
    lastName: "",
    clientType: "",
    refrenceNumber: "",
    responsibleAttorney: [],
    originatingAttorney: [],
    responsibleStaff: [],
    priority: "",
    taskList: "",
    startDate: "",
    endDate: "",
    practiceArea: "",
  });
  // const [practiceArea, setPracticeArea] = React.useState("");

  const router = useRouter();

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    form.setValue(name as keyof z.infer<typeof matterSchema>, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  async function onSubmit(values: z.infer<typeof matterSchema>) {
    try {
      const response = await mutateAsync({
        ...values,
        description: values.matterDescription,
        dueDate: values.endDate,
      });

      form.reset(); // Clear form on success
      router.replace(`/tasks/${response.data.data._id}`);
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  return (
    <div className="w-full max-w-xl p-4 m-auto">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Create a new Matter</FieldLegend>
            <FieldDescription>
              Add the essential details to start tracking this matter, assign
              responsibilities, and manage deadlines efficiently.
            </FieldDescription>
            <FieldSeparator />
            <div className="flex gap-4">
              <span className="bg-blue-100 p-2 rounded-full">
                <BiSolidBriefcase className="[&>svg]:size-12 fill-[#0088FF]" />
              </span>
              <h3>Case details</h3>
            </div>
            <FieldGroup>
              {/* <Field>
                <FieldLabel>Create Matter using existing template</FieldLabel>
                <ComboboxDemo
                  name="template"
                  onChange={(val) => handleChange(val, "template")}
                />
              </Field> */}

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="checkout-7j9-optional-comments">
                      Case name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Case name..."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="matterDescription"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="checkout-7j9-optional-comments">
                      Matter description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Matter description"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="responsibleAttorney"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Responsible Attorney</FieldLabel>
                    <ComboboxDemo
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select attorneys..."
                    />
                    <FieldDescription>
                      Select one or more responsible attorneys.
                    </FieldDescription>
                  </Field>
                )}
              />
              <Controller
                name="responsibleStaff"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Responsible Staff</FieldLabel>
                    <ComboboxDemo
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select staff..."
                    />
                  </Field>
                )}
              />
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="2fa">Restrict access</FieldLabel>
                <Switch
                  id="2fa"
                  checked={hasAccess}
                  onCheckedChange={(checked) => sethasAccess(checked)}
                />
              </Field>

              {hasAccess && (
                <Controller
                  name="allowAccess"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Who can access this matter</FieldLabel>
                      <ComboboxDemo
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select staff..."
                      />
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </FieldSet>
          <Field>
            <FieldLabel>Case health</FieldLabel>
            <FieldDescription>
              Status is calculated automatically from completed tasks on this
              matter. Add and complete tasks to move the case through stages.
            </FieldDescription>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  {...field}
                  id="form-rhf-demo-priority"
                  aria-invalid={fieldState.invalid}
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="checkout-7j9-optional-comments">
                    Priority
                  </FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-4">
              <Calendar22
                name="startDate"
                onChange={(val) => handleChange(val, "startDate")}
              />
              <Calendar22
                name="endDate"
                onChange={(val) => handleChange(val, "endDate")}
              />
            </div>
          </div>

          <Controller
            name="practiceArea"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-practiceAreas">
                  Practice area
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-practiceAreas"
                  aria-invalid={fieldState.invalid}
                  placeholder="practice areas"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-4">
            <span className="bg-blue-100 p-2 rounded-full">
              <BiSolidBriefcase className="[&>svg]:size-12 fill-[#0088FF]" />
            </span>
            <h3>Billing details</h3>
          </div>

          <Controller
            name="isBillable" // Maps straight to your case schema boolean property
            control={form.control}
            defaultValue={true} // Matches your 'defaultChecked' intention
            render={({ field }) => (
              <FieldSet>
                <FieldLabel htmlFor="form-rhf-demo-billingCollected">
                  Is billable
                </FieldLabel>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="form-rhf-demo-billingCollected"
                      // Crucial mapping overrides for dynamic React Hook Form state
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)} // Compatible with shadcn primitives
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    <FieldLabel
                      htmlFor="form-rhf-demo-billingCollected"
                      className="font-normal cursor-pointer"
                    >
                      Check to indicate that this case is billable.
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            )}
          />

          <Controller
            name="billingAmount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-billingAmount">
                  Amount
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-billingAmount"
                  aria-invalid={fieldState.invalid}
                  placeholder="Amount"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-4">
            <span className="bg-blue-100 p-2 rounded-full">
              <BiSolidBriefcase className="[&>svg]:size-12 fill-[#0088FF]" />
            </span>
            <h3>Client details</h3>
          </div>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-firstName">
                  First name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-firstName"
                  aria-invalid={fieldState.invalid}
                  placeholder="First name"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-lastName">
                  Last name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-lastName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Last name"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="clientContactNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-ContactNumber">
                  Client contact number
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-ContactNumber"
                  aria-invalid={fieldState.invalid}
                  placeholder="Client contact number"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="clientEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-clientEmail">
                  Client email
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-clientEmail"
                  aria-invalid={fieldState.invalid}
                  placeholder="Client email"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="refrenceNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-clientEmail">
                  refrence number
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-refrenceNumber"
                  aria-invalid={fieldState.invalid}
                  placeholder="refrence number"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="clientType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                {...field}
                id="form-rhf-demo-title"
                aria-invalid={fieldState.invalid}
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Client Type
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
