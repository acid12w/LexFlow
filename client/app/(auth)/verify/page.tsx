"use client";

import { useForm, Controller } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEmailVerification } from "@/hooks/useAuthHook";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import router from "next/router";

function Verify() {
  const { mutateAsync } = useEmailVerification();

  // 1. Initialize the form hook
  const form = useForm({
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(value) {
    try {
      await mutateAsync(value.otp);

      router.replace(`/account-type`);

      form.reset(); // Clear form on success
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

  return (
    <form
      className="flex flex-col justify-center items-center h-screen"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="otp" // 2. Renamed to match OTP context
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="w-fit">
            <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>

            {/* 3. Pass value and onChange directly to InputOTP */}
            <InputOTP
              id="digits-only"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              data-invalid={fieldState.invalid}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {/* 4. Render error correctly if invalid */}
            {fieldState.error?.message && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Verify;
