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

import { ComboboxDemo } from "@/features/combo-box/comboBox";
import { useState } from "react";

import { useCreateMatters } from "@/hooks/useMatterHook";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils-helper";
import { Check } from "lucide-react";

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
  clientId: z.string().trim().toLowerCase(),
});

export interface ActiveClientState {
  id: string;
  firstName: string;
  lastName: string;
  refrenceNumber?: string;
  avatarUrl?: string;
}

// ✅ Wrap ActiveClientState inside the props interface
interface MatterFieldProps {
  activeClient: {
    id: string;
    firstName: string;
    lastName: string;
    refrenceNumber?: string;
    avatarUrl?: string;
    selectedClientId: string;
  };
  onSuccess: () => void;
  onBack: () => void;
}

export type MatterFormValues = z.output<typeof matterSchema>;
export type MatterFormInput = z.input<typeof matterSchema>;

export default function MatterField({
  activeClient,
  onSuccess,
  onBack,
}: MatterFieldProps) {
  const { mutateAsync, isPending } = useCreateMatters();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasAccess, sethasAccess] = useState<boolean>(false);

  const form = useForm<MatterFormInput, unknown, MatterFormValues>({
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
      clientId: "",
    },
  });

  const [formData, setFormData] = useState({
    template: "",
    title: "",
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
      //   const response = await mutateAsync({
      //     ...values,
      //     clientId: activeClient.selectedClientId,
      //   });

      onSuccess();

      form.reset(); // Clear form on success
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

            <button
              type="button"
              className="w-full text-left flex justify-between items-center p-3 rounded-xl transition-all duration-150 border-2  border-[#0088FF] bg-[#E2F1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex justify-center">
                <Avatar className="mr-4 h-10 w-10 shrink-0">
                  {activeClient.avatarUrl && (
                    <AvatarImage
                      src={activeClient.avatarUrl}
                      alt={activeClient.firstName}
                    />
                  )}
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                    {getInitials(activeClient.firstName, activeClient.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {activeClient.firstName} {activeClient.lastName ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Ref: {activeClient.refrenceNumber}
                  </p>
                </div>
              </div>
              <button
                className="text-sm text-[#0473d4] cursor-pointer"
                onClick={onBack}
              >
                Change
              </button>
            </button>
            <FieldSeparator />
            <div className="flex gap-4">
              <span className="bg-blue-100 p-2 rounded-full">
                <BiSolidBriefcase className="[&>svg]:size-12 fill-[#0088FF]" />
              </span>
              <h3>Case details</h3>
            </div>
            <FieldGroup>
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
                  type="number"
                  value={
                    field.value === undefined || field.value === null
                      ? ""
                      : String(field.value)
                  }
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

          <Field orientation="horizontal" className="flex justify-between">
            <Button type="button" variant={"outline"} onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
