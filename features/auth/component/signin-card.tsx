  "use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

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

const formSchema = z.object({
   
    email: z.string(),
    password: z.string()
});


export const SignInCard = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password:""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
         
    return(
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[70%] md:w-1/2" >
          <FieldSet >
            <FieldLegend className="">Login to your account</FieldLegend>
            <FieldDescription>Welcome back select a signing method</FieldDescription>
            <FieldGroup>
              
            </FieldGroup>
            <FieldGroup>
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
                            placeholder="Email"
                            autoComplete="off"
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
                            placeholder="Password"
                            autoComplete="off"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                        </Field>
                    )}
                    />
                    <Field orientation="horizontal">
                    <Checkbox
                        id="checkout-7j9-same-as-shipping-wgm"
                        defaultChecked
                    />
                    <FieldLabel
                        htmlFor="checkout-7j9-same-as-shipping-wgm"
                        className="font-normal"
                    >
                        Remember me
                    </FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                    <Button className="w-full" type="submit">Signin</Button>
                    </Field>
                </FieldGroup>
          </FieldSet>
        </form>
    )
}