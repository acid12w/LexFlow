"use client";

import FirmRegistration from "./firm/page";
import { useCreateFirm } from "@/hooks/useAuthHook";

const RegisterPage = () => {
  const { mutateAsync } = useCreateFirm();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <FirmRegistration
        createFirm={async (values) => {
          await mutateAsync(values);
        }}
      />
    </main>
  );
};

export default RegisterPage;
