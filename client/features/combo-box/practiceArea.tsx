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

type PracticeAreaComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

const practiceAreas = [
  {
    label: "Corporate & Business Law",
    options: [
      { value: "corporate-law", label: "Corporate Law" },
      { value: "mergers-acquisitions", label: "Mergers & Acquisitions (M&A)" },
      { value: "business-formation", label: "Business Formation & Governance" },
      { value: "securities-law", label: "Securities Law" },
      { value: "venture-capital", label: "Venture Capital & Startups" },
      { value: "corporate-compliance", label: "Corporate Compliance" },
    ],
  },
  {
    label: "Litigation & Dispute Resolution",
    options: [
      { value: "civil-litigation", label: "Civil Litigation" },
      { value: "commercial-litigation", label: "Commercial Litigation" },
      { value: "arbitration", label: "Arbitration" },
      { value: "mediation", label: "Mediation" },
      { value: "class-action", label: "Class Action Litigation" },
      { value: "appellate-law", label: "Appellate Law" },
    ],
  },
  {
    label: "Family & Personal Law",
    options: [
      { value: "family-law", label: "Family Law" },
      { value: "divorce-separation", label: "Divorce & Separation" },
      { value: "child-custody", label: "Child Custody & Support" },
      { value: "adoption", label: "Adoption" },
      { value: "estate-planning", label: "Estate Planning" },
      { value: "probate", label: "Probate & Estate Administration" },
    ],
  },
];

// Flatten options for lookup
const flatOptions = practiceAreas.flatMap((group) => group.options);

export function PracticeAreaCombobox({
  value,
  onChange,
}: PracticeAreaComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = flatOptions.find((item) => item.value === value);

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium">Practice Area</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected ? selected.label : "Select practice area..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search practice area..." />
            <CommandList>
              <CommandEmpty>No practice area found.</CommandEmpty>

              {practiceAreas.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
