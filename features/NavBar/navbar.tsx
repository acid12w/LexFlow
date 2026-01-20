"use client";

import { MdOutlineNotificationsNone } from "react-icons/md";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavigationMenuBar() {
  return (
    <nav className="border-b py-2 px-6 w-full ">
      <ul className=" w-full flex justify-between">
        <li>
          <MdOutlineNotificationsNone className="text-2xl" />
        </li>
        <li className=" flex items-center gap-2">
          <div>
            <MdOutlineNotificationsNone className="text-2xl" />
          </div>
          <div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </li>
      </ul>
    </nav>
  );
}
