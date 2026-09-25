"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateClient } from "@/hooks/useClientHook";

export const clientSchema = z.object({
  clientEmail: z.string().email("Invalid email address").trim().toLowerCase(),

  clientContactNumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{6,14}$/, {
      message:
        "Invalid phone number format. Use international or local numeric format.",
    }),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),

  clientType: z.enum(["Individual", "Business"]),

  refrenceNumber: z
    .string()
    .trim()
    .min(3, "Reference number must be at least 3 characters")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message:
        "Reference number must be alphanumeric (letters, numbers, hyphens only).",
    }),
});

export type ClientFormValues = z.output<typeof clientSchema>;
export type ClientFormInput = z.input<typeof clientSchema>;

const NewClientForm = () => {
  const { mutateAsync, isPending } = useCreateClient();

  const form = useForm<ClientFormInput, unknown, ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onTouched",
    defaultValues: {
      clientEmail: "",
      clientContactNumber: "",
      firstName: "",
      lastName: "",
      clientType: "Individual",
      refrenceNumber: "",
    },
  });

  async function onSubmit(values: ClientFormValues) {
    try {
      await mutateAsync(values);
      form.reset();
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New client</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client details below. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    aria-invalid={fieldState.invalid}
                    placeholder="First name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
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
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    aria-invalid={fieldState.invalid}
                    placeholder="Last name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
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
                  <FieldLabel htmlFor="clientContactNumber">
                    Client contact number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="clientContactNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder="+1234567890"
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
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
                  <FieldLabel htmlFor="clientEmail">Client email</FieldLabel>
                  <Input
                    {...field}
                    id="clientEmail"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="client@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
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
                  <FieldLabel htmlFor="refrenceNumber">
                    Reference number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="refrenceNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder="REF-1001"
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="clientType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Client Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientForm;
