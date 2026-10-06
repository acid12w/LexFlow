"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetClientDetails } from "@/hooks/useClientHook";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils-helper";
import { ArrowRight, Mail, MapPinHouse, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ClientDetails = () => {
  const params = useParams();
  const clientId = params?.clientId;
  console.log(clientId);
  const {
    data: clientData,
    isLoading,
    isError,
    error,
  } = useGetClientDetails(clientId as string);

  console.log(clientData);

  // ✅ FIXED: Safely look up styles from the extracted status styling matrix block

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center mt-6">
        <Avatar className="mr-4 h-20 w-20 shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary font-semibold ">
            {getInitials("james", "Blake")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-2xl font-bold">John smith</h3>
          <p>Individual</p>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col gap-4 border w-[20rem] p-6 rounded-md">
          <h2 className=" mt-4 text-lg font-bold">Contact details</h2>
          <p className="flex gap-x-2">
            <Mail />
            {clientData?.data.clientData.email}
          </p>
          <p className="flex gap-x-2">
            <Phone />
            (876) 877-9387
          </p>
          <p className="flex gap-x-2">
            <MapPinHouse />
            adress
          </p>
          <h2 className=" mt-4 text-lg font-bold">Client Details</h2>
          <p>{clientData?.data.clientData.firstName}</p>
          <p>{clientData?.data.clientData.lastName}</p>
          <p>Business type: {clientData?.data.clientData.type}</p>
          <h2 className=" mt-4 text-lg font-bold border-t">Created</h2>
          <p>Aug 5, 2026</p>
        </div>
        <div className="flex flex-col gap-4  w-1/2 p-6">
          <div className="flex justify-between">
            <p>Matters (2)</p>{" "}
            <Link href="/matters">
              <Button>New matter</Button>
            </Link>
          </div>

          {clientData?.data.clientMatters.response.map((matter: any) => (
            <div
              key={matter._id}
              className="grid grid-cols-3 border rounded-md text-left p-4"
            >
              <div className="p-2 justify-self-start text-center rounded">
                <div className="">matter</div>
              </div>
              <div
                className={cn(
                  "h-max w-max flex gap-x-2 items-center px-2 py-1 rounded-full"
                )}
              >
                <span className={cn("w-3 h-3 rounded-full")} />
                <p className="text-sm font-bold">{matter.status}</p>
              </div>
              <div className="p-2 row-span-2 justify-self-end text-center rounded text-gray-500">
                <Link href={`/tasks/${matter._id}`}>
                  <ArrowRight />
                </Link>
              </div>
              <div className=" p-2 justify-self-start text-center rounded">
                {matter.title}
              </div>
              Due date: {matter.endDate}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
