// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";

// import { Input } from "@/components/ui/input";
// import { InputTags } from "@/features/inputTag/tagInput";
// import { Label } from "@/components/ui/label";

// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
//   FieldError,
//   FieldLegend,
// } from "@/components/ui/field";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";

// const formSchema = z.object({
//   username: z.string().min(3, "Username must be at least 3 characters."),
//   company: z.string().min(1, "Company name is required."),
//   email: z.string().email("Please enter a valid email address."),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters.")
//     .regex(
//       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
//       "Min 8 chars, at least one uppercase, one lowercase, and one number"
//     ),
//   firstName: z.string().min(1, "First name is required."),
//   lastName: z.string().min(1, "Last name is required."),
// });

// // async function onSubmit(values: z.infer<typeof formSchema>) {
// //   try {
// //     const response = await mutateAsync({
// //       userName: values.username,
// //       password: values.password,

// //       profile: {
// //         firstName: values.firstName,
// //         lastName: values.lastName,
// //         email: values.email,
// //       },
// //     });
// //   } catch {
// //     // Error alert handled in useSignup onError
// //   }
// // }

// const WorkspaceRegistration = () => {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: "onTouched",
//     defaultValues: {
//       username: "",
//       company: "",
//       email: "",
//       password: "",
//       firstName: "",
//       lastName: "",
//     },
//   });

//   const [workspace, setWorkSpace] = useState([]);

//   const [values, setValues] = useState<string[]>([]);

//   return (
//     <form className=" w-full md:w-1/2">
//       <FieldSet>
//         <FieldLegend className="">Set preffrences</FieldLegend>
//         <FieldDescription>
//           Register a new firm and admin account.
//         </FieldDescription>
//         <FieldGroup>
//           <Controller
//             name="workspaceName"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <Input
//                   {...field}
//                   aria-invalid={fieldState.invalid}
//                   placeholder="currency"
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//           <Controller
//             name="hourlyRate"
//             control={form.control}
//             render={({ field, fieldState }) => (
//               <Field data-invalid={fieldState.invalid}>
//                 <Input
//                   {...field}
//                   aria-invalid={fieldState.invalid}
//                   placeholder="hourlyRate"
//                 />
//                 {fieldState.invalid && (
//                   <FieldError errors={[fieldState.error]} />
//                 )}
//               </Field>
//             )}
//           />
//         </FieldGroup>
//         <FieldGroup>
//           {workspace.map((item, index) => {
//             return (
//               <div key={index} className="p-4 bg-amber-200">
//                 {item}
//               </div>
//             );
//           })}
//           <Field orientation="horizontal">
//             <Button className="w-full" type="submit">
//               submit
//             </Button>
//           </Field>
//         </FieldGroup>
//       </FieldSet>
//     </form>
//   );
// };

// export default WorkspaceRegistration;
