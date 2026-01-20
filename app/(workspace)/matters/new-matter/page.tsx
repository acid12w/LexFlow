"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
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

const formSchema = z.object({
  template: z.string(),
  clientName: z.string(),
  matterDescription: z.string(),
  responsibleAttorney: z.string(),
  originatingAttorney: z.string(),
  responsibleStaff: z.string(),
  status: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  access: z.string(),
  isBillable: z.string(),
  billingMethods: z.string(),
  rate: z.string(),
  practiceArea: z.string(),
  taskList: z.string(),
});
export default function MatterField() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      template: "",
      clientName: "",
      matterDescription: "",
      responsibleAttorney: "",
      originatingAttorney: "",
      responsibleStaff: "",
      status: "",
      startDate: "",
      endDate: "",
      access: "",
      isBillable: "",
      billingMethods: "",
      rate: "",
      taskList: "",
      practiceArea: "",
    },
  });

  const [formData, setFormData] = useState({
    template: "",
    clinetName: "",
    responsibleAttorney: "",
    originatingAttorney: "",
    responsibleStaff: "",
    taskList: "",
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
    console.log(formData, values);
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
              <Field>
                <FieldLabel>Create Matter using existing template</FieldLabel>
                <ComboboxDemo
                  name="template"
                  onChange={(val) => handleChange(val, "template")}
                />
              </Field>
              <Controller
                name="clientName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Client name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Client name"
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

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Responsible Attorney</FieldLabel>
                  <ComboboxDemo
                    name="responsibleAttorney"
                    onChange={(val) => handleChange(val, "responsibleAttorney")}
                  />
                  <FieldDescription>
                    Select your department or area of work.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Originating Attorney</FieldLabel>
                  <ComboboxDemo
                    name="originatingAttorney"
                    onChange={(val) => handleChange(val, "originatingAttorney")}
                  />
                  <FieldDescription>
                    Select your department or area of work.
                  </FieldDescription>
                </Field>
              </div>
              <Field>
                <FieldLabel>Responsible Staff</FieldLabel>
                <ComboboxDemo
                  name="responsibleStaff"
                  onChange={(val) => handleChange(val, "responsibleStaff")}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  {...field}
                  // id="form-rhf-demo-title"
                  // aria-invalid={fieldState.invalid}
                  // placeholder="Matter description"
                  // autoComplete="off"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="checkout-7j9-optional-comments">
                    Matter status
                  </FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Not started</SelectItem>
                      <SelectItem value="design">Inprogress</SelectItem>
                      <SelectItem value="marketing">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="clientName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  {...field}
                  // id="form-rhf-demo-title"
                  // aria-invalid={fieldState.invalid}
                  // placeholder="Matter description"
                  // autoComplete="off"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="checkout-7j9-optional-comments">
                    Matter status
                  </FieldLabel>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
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

          <FieldSeparator />
          <div className="flex gap-4">
            <span className="bg-blue-100 p-2 rounded-full">
              <MdOutlineSecurity className="[&>svg]:size-12 fill-[#0088FF]" />
            </span>
            <h3>Permissions</h3>
          </div>
          <Controller
            name="clientName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                {...field}
                // id="form-rhf-demo-title"
                // aria-invalid={fieldState.invalid}
                // placeholder="Matter description"
                // autoComplete="off"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Matter status
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FieldLabel>Billing Prefrences</FieldLabel>
          <FieldDescription>Is Billable.</FieldDescription>
          {/* <Field>
            <Controller
              name="isBillable"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  {...field}
                  // id="form-rhf-demo-title"
                  // aria-invalid={fieldState.invalid}
                  // placeholder="Matter description"
                  // autoComplete="off"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox id="push" defaultChecked disabled />
                  <FieldLabel htmlFor="checkout-7j9-optional-comments">
                    Matter status
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </Field> */}
          <Controller
            name="clientName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                {...field}
                // id="form-rhf-demo-title"
                // aria-invalid={fieldState.invalid}
                // placeholder="Matter description"
                // autoComplete="off"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Matter status
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="practiceArea"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                {...field}
                // id="form-rhf-demo-title"
                // aria-invalid={fieldState.invalid}
                // placeholder="Matter description"
                // autoComplete="off"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor="checkout-7j9-optional-comments">
                  Practice Area
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Customer Support</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-4">
            <span className="bg-blue-100 p-2 rounded-full">
              <TbSubtask className="[&>svg]:size-12 text-[#0088FF]" />
            </span>
            <h3>Task</h3>
          </div>
          <Field>
            <ComboboxDemo
              name="task"
              onChange={(val) => handleChange(val, "task")}
            />
          </Field>

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
