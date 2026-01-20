"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface userObj {
  userData: any[];
  displaySize: number;
}

export function AvatarGroup({ userData, displaySize }: userObj) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {userData.slice(0, displaySize).map((user) => {
          return (
            <div className="relative" key={user.id}>
              <Avatar>
                <AvatarImage src={user.profileImage} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          );
        })}
        {userData.length > displaySize && (
          <div className="relative">
            <Avatar>
              <AvatarFallback>+{userData.length - 2}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
