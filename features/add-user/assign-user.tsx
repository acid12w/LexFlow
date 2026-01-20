"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { RiUserAddLine } from "react-icons/ri";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  {
    id: "u1",
    name: "Diane Leveridge",
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "u2",
    name: "Marcus Brown",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "u3",
    name: "Sacia Anderson",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "u4",
    name: "Andre Williams",
    profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: "u5",
    name: "Tuered Davis",
    profileImage: "https://randomuser.me/api/portraits/men/18.jpg",
  },
];

// Inside ComboboxDemo.tsx
interface AssignUser {
  openState: boolean;
  onChange: (value: {}, id: string) => void;
}

export function AssignUser({ onChange, openState }: AssignUser) {
  const [open, setOpen] = React.useState(openState);
  const [id, setId] = React.useState("");

  return (
    <div className="flex flex-col gap-8 justify-end absolute right-0 top-12">
      <div className="flex gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between "
            >
              {id
                ? frameworks.find((framework) => framework.id === id)?.name
                : "Select framework..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.id}
                      value={framework.id}
                      onSelect={(currentValue) => {
                        const newValue = currentValue === id ? "" : framework;
                        setId(currentValue === id ? "" : currentValue);
                        setOpen(false);
                        onChange(newValue, id);
                      }}
                    >
                      {framework.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          id === framework.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
