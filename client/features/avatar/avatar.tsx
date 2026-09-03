"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUsersByArray } from "@/hooks/useAuthHook";

interface userObj {
  userData: any[];
  displaySize: number;
}

export function AvatarGroup({ userData, displaySize }: userObj) {
  const [open, setOpen] = React.useState(false);

  const { data: assignee } = useGetUsersByArray(userData);

  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {assignee?.data.data.slice(0, displaySize).map((user) => {
          const fallBackName = user.userName.slice(0, 2);
          return (
            <div className="relative" key={user._id}>
              <Avatar className="">
                <AvatarImage src={user.profileImage} alt="@shadcn" />
                <AvatarFallback>{fallBackName}</AvatarFallback>
              </Avatar>
            </div>
          );
        })}
        {assignee?.data.data.length > displaySize && (
          <div className="relative">
            <Avatar>
              <AvatarFallback>+{assignee?.data.length - 2}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
