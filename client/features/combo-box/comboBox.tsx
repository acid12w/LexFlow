"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useUserCredentials } from "@/app/store/user-store";

export type FirmMember = {
  _id: string;
  userName?: string;
  profile?: { firstName?: string; lastName?: string };
  profileImg?: string;
};

export interface ComboboxDemoProps {
  name?: string;
  value?: string[];
  onChange: (assigneeIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

function memberLabel(member: FirmMember) {
  if (member.profile?.firstName || member.profile?.lastName) {
    return [member.profile.firstName, member.profile.lastName]
      .filter(Boolean)
      .join(" ");
  }
  return member.userName ?? "Unknown";
}

export function ComboboxDemo({
  value = [],
  onChange,
  placeholder = "Select members...",
  className,
}: ComboboxDemoProps) {
  const members = useUserCredentials(
    (state) => (state.members as FirmMember[]) ?? []
  );

  const [open, setOpen] = React.useState(false);
  const selectedIds = React.useMemo(() => new Set(value), [value]);

  const toggleMember = (memberId: string) => {
    const next = selectedIds.has(memberId)
      ? value.filter((id) => id !== memberId)
      : [...value, memberId];
    onChange(next);
  };

  const selectedMembers = members.filter((m) => selectedIds.has(m._id));

  const triggerLabel =
    selectedMembers.length === 0
      ? placeholder
      : selectedMembers.length === 1
      ? memberLabel(selectedMembers[0])
      : `${selectedMembers.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search member..." className="h-9" />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => {
                const isSelected = selectedIds.has(member._id);
                return (
                  <CommandItem
                    key={member._id}
                    value={`${member.userName ?? ""} ${memberLabel(member)}`}
                    onSelect={() => toggleMember(member._id)}
                  >
                    {memberLabel(member)}
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
