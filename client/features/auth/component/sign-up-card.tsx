"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
  FieldLegend,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { useSignup } from "@/hooks/useAuthHook";
import { useUserCredentials } from "@/app/store/user-store";
import { toast } from "sonner";

const formSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters."),
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Min 8 chars, at least one uppercase, one lowercase, and one number"
    ),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
});

export const SignUpCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteFirmId = searchParams.get("inviteFirmId") ?? undefined;
  const { mutateAsync, isPending } = useSignup();
  const setUserCredentials = useUserCredentials(
    (state) => state.setUserCredentials
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      password: values.password,
      userName: values.userName,
      profile: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      },
    };
    try {
      const response = await mutateAsync(payload);

      toast.success("Account created successfully.");
      router.replace("/register");
    } catch {
      // Error alert handled in useSignup onError
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className=" w-[70%] md:w-1/2">
      <FieldSet>
        <FieldLegend className="">Create your account</FieldLegend>
        <FieldDescription>
          {inviteFirmId
            ? "Join your firm using an invite link."
            : "Register a new firm and admin account."}
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel htmlFor="form-rhf-demo-title">
                            Email
                        </FieldLabel> */}
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="first name"
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
                {/* <FieldLabel htmlFor="form-rhf-demo-title">
                            Email
                        </FieldLabel> */}
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="last name"
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel htmlFor="form-rhf-demo-title">
                            Email
                        </FieldLabel> */}
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="email"
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
            name="userName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel htmlFor="form-rhf-demo-title">
                            Email
                        </FieldLabel> */}
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="User Name"
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel htmlFor="form-rhf-demo-title">
                            Password
                        </FieldLabel> */}
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
