"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { InputTags } from "@/features/inputTag/tagInput";
import { Label } from "@/components/ui/label";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSet,
  FieldError,
  FieldLegend,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters."),
  country: z.string().min(1, "Company name is required."),
  practiceAreas: z
    .array(z.string())
    .min(1, "Select at least one practice area."),
  logo: z.instanceof(File).optional(),
  workspace: z.string().min(1, "Last name is required."),
});

const FirmRegistration = ({ createFirm }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      country: "",
      practiceAreas: [],
      logo: undefined,
      workspace: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      await createFirm(values);
      router.push("/user-dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
      <FieldSet>
        <FieldLegend className="">Register your new firm</FieldLegend>
        <FieldDescription>
          Register a new firm and admin account.
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Firm name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="country"
                  autoComplete="country"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="practiceAreas"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-y-2">
                <Label>Assigned Practice Areas</Label>

                <InputTags
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add practice areas..."
                />
              </div>
            )}
          />
          <Controller
            name="logo"
            control={form.control}
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            )}
          />
          <Controller
            name="workspace"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="workspace name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {/* <Controller
            name="workspaceName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="currency"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="hourlyRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="hourlyRate"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          /> */}
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal">
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default FirmRegistration;
