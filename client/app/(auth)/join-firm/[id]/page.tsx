"use client";

import { useUserCredentials } from "@/app/store/user-store";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useGetInvitationById, useJoinfirmMember } from "@/hooks/useAuthHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z
  .object({
    userName: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

function JoinFirm() {
  const params = useParams();

  // If your folder is app/register/[id]/page.tsx, params.id gets the token string
  const token = typeof params.id === "string" ? params.id : "";

  // 1. Fetching validation state from your React Query hook
  const {
    data: invitation,
    isLoading: isTokenLoading,
    isError: isTokenInvalid,
  } = useGetInvitationById(token);

  const { mutateAsync, isPending: isSubmitting } = useJoinfirmMember();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setUserCredentials = useUserCredentials(
    (state) => state.setUserCredentials
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await mutateAsync({
        userName: values?.userName,
        password: values?.password,
        token: token,
      });

      setUserCredentials(user.data.user);

      router.replace("/user-dashboard");
    } catch (storeError) {
      console.error(
        "Zustand fetchMembers failed, but proceeding to redirect:",
        storeError
      );
    }
  };

  // 2. Clear handling for the loading and error states of the link
  if (isTokenLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Verifying invitation link...
        </div>
      </main>
    );
  }

  if (
    isTokenInvalid ||
    invitation?.data.response?.status === "ACCEPTED" ||
    !invitation?.response
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Invalid or Expired Link
          </h2>
          <p className="text-sm text-muted-foreground">
            This activation link has already been used or has expired. Please
            contact your administrator to request a new invitation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] md:w-1/3">
        <FieldSet>
          <FieldLegend>Activate Your Account</FieldLegend>

          <FieldDescription>
            You have been invited to join {invitation.data.response?.firmName}.
            Create your account credentials below.
          </FieldDescription>

          <FieldGroup>
            <Controller
              name="userName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="Username" />
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
                  <Input
                    {...field}
                    type="password"
                    placeholder="New password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* 3. Disable button during active form mutations to prevent double submission */}
          <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Activating..." : "Activate Account"}
          </Button>
        </FieldSet>
      </form>
    </main>
  );
}

export default JoinFirm;
