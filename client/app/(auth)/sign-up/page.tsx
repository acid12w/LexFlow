"use client";

import { Suspense } from "react";
import { SignUpCard } from "@/features/auth/component/sign-up-card";

import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

// import { Checkbox } from "@/components/ui/checkbox"

const SignUpPage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 w-full flex py-8 md:py-0">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
        <Suspense fallback={<div className="w-[70%] md:w-1/2">Loading...</div>}>
          <SignUpCard />
        </Suspense>
        <div className="mt-4 flex gap-4 flex-col w-[70%] md:w-1/2 text-center">
          <aside className="flex justify-center items-center gap-2">
            <span className="bg-border shrink w-24 h-px"></span>
            <p className="text-sm text-gray-500 flex-none">or</p>
            <span className="bg-border shrink w-24 h-px"></span>
          </aside>

          <aside>
            <p className="text-sm text-gray-500">
              Already have an Account ?{" "}
              <Link className="text-blue-500" href={"/sign-in"}>
                Sign In
              </Link>
            </p>
          </aside>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-6 hidden md:block">
        <div className="bg-[#0974FF] pt-4 pb-16 px-4 h-[92vh] flex flex-col justify-between rounded-xl">
          <Image src="/logo.png" height={150} width={150} alt="Logo" />
          <div className="flex flex-col items-center gap-15">
            <Image src="/clendar.png" height={300} width={300} alt="Logo" />
            <div className="text-center ">
              <h2 className="text-white text-4xl mb-4">Steady easy and fast</h2>
              <p className="text-blue-100 px-4">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
