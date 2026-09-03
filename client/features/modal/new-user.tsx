import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSignup } from "@/hooks/useAuthHook";
import z from "zod";
import { useState } from "react";

// 1. Move schema outside the component to prevent re-instantiation on renders
const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  role: z
    .string({ required_error: "Please select a role" })
    .min(1, "Please select a role"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function NewUserDialog() {
  const { mutateAsync } = useSignup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      userName: "",
      role: "",
      password: "",
      email: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { userName, email, role, password } = values;

    const profile = {
      email,
    };
    const user = { userName, role, password, profile };

    try {
      await mutateAsync(user);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add user</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        {/* 2. Wrap form elements inside DialogContent */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>Add a new firm member.</DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              {/* 3. Register input fields with react-hook-form */}
              <Input
                id="username-1"
                type="text"
                {...form.register("userName")}
              />
              {form.formState.errors.userName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.userName.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </Field>
            <Field>
              <Label htmlFor="role-1">Role</Label>

              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="role-1" className="h-8">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Attorney">Attorney</SelectItem>
                      <SelectItem value="Paralegal">Paralegal</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.role && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.role.message}
                </p>
              )}
            </Field>

            <Field>
              <Label htmlFor="password-1">Password</Label>
              <Input
                id="password-1"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            {/* 4. Explicitly add type="submit" */}
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
