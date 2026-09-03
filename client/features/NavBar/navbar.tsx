"use client";

import { MdOutlineNotificationsNone } from "react-icons/md";

import { StopWatch } from "../stopWatch/stopWatch";
import { useUserCredentials } from "@/app/store/user-store";
import { DropdownMenuShortcuts } from "@/features/drop-down/drop-down";

export function NavigationMenuBar() {
  const userData = useUserCredentials((state) => state?.user);

  return (
    <nav className="border-b py-2 px-6 w-full bg-white">
      <ul className=" w-full flex justify-between">
        <li>
          <StopWatch userData={userData} />
        </li>
        <li className=" flex items-center gap-2">
          {/* <div>
            <MdOutlineNotificationsNone className="text-2xl" />
          </div> */}
          <div>
            <DropdownMenuShortcuts />
          </div>
        </li>
      </ul>
    </nav>
  );
}
