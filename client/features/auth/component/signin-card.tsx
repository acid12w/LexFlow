"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldDescription,
  FieldLegend,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldError,
} from "@/components/ui/field";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

import { useSignin } from "@/hooks/useAuthHook";
import { useRouter } from "next/navigation";

import { useUserCredentials } from "@/app/store/user-store";
import { toast } from "sonner";

const formSchema = z.object({
  userName: z.string(),
  password: z.string(),
});

export const SignInCard = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });
  const fetchMembers = useUserCredentials((state) => state.fetchMembers);

  const setUserCredentials = useUserCredentials(
    (state) => state.setUserCredentials
  );

  const { mutateAsync } = useSignin();

  const router = useRouter(); // Initialize here

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.userName === "" || values.password === "") {
      toast.error("Incorrect email or password. Please try again.");
      return;
    }
    try {
      const user = await mutateAsync(values);

      setUserCredentials(user.data.user);

      // 2. Wrap this in a separate try/catch if it's optional for navigation
      try {
        if (user.data.user.firmId) {
          await fetchMembers();
        } else {
          console.warn("firmId is missing, skipping fetchMembers");
        }
      } catch (storeError) {
        console.error(
          "Zustand fetchMembers failed, but proceeding to redirect:",
          storeError
        );
      }

      // ✅ Move this here so it only redirects on SUCCESS
      router.replace("/dashboard/user");
    } catch (error) {
      console.error("Mutation failed:", error);
      // You should probably show a toast error here
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] md:w-1/2">
      <FieldSet>
        <FieldLegend className="">Login to your account</FieldLegend>
        <FieldDescription>
          Welcome back select a sign in method
        </FieldDescription>
        <FieldGroup></FieldGroup>
        <FieldGroup>
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
                  placeholder="username"
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
          <Field orientation="horizontal">
            <Checkbox id="checkout-7j9-same-as-shipping-wgm" defaultChecked />
            <FieldLabel
              htmlFor="checkout-7j9-same-as-shipping-wgm"
              className="font-normal"
            >
              Remember me
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};
