import { Button } from "@/components/ui/button";
import { AssignUser } from "../add-user/assign-user";
import { AvatarGroup } from "./avatar";
import { RiUserAddLine } from "react-icons/ri";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function UserGroup ({className, displayValue=2 }){
    
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState<User[]>([]);
  type User = { id: string; [key: string]: any };

  const handleAddUser = (value: User, id: string) => {
    setFormData((prevItems: User[]) => {
      const isDuplicate = formData.some((item) => item.id === value.id);

      if (isDuplicate) {
        return prevItems;
      }

      setOpen(false);
      return [...prevItems, value];
    });
  };
    return(
        <div className="flex gap-4 relative">
            <AvatarGroup userData={formData} displaySize={displayValue}/>
            {open && (
              <AssignUser
                openState={open}
                onChange={(val: {}, id: string) => handleAddUser(val, id)}
              />
            )}  <Button
              type="button"
              onClick={() => setOpen(!open)}
              size="icon"
              className={cn("rounded-full outline-dashed", className)}>
              <RiUserAddLine className="fill-blue-800" />
            </Button>
          </div>
    )
    
}