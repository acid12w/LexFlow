"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useGetAllMattersByUserId } from "@/hooks/useMatterHook";

// Define a proper type interface for your user data
interface UserData {
  id: string;
  [key: string]: any;
}

export function GenericCombobox({
  userData,
  value,
  onChange,
}: {
  userData: UserData; // Fixed: avoid empty object type '{}'
  value?: string;
  onChange?: (val: string) => void;
}) {
  const {
    data: caseData,
    isLoading,
    isError,
  } = useGetAllMattersByUserId(userData?.id);

  // 1. Fixed Condition: Render loading text while it IS loading or data hasn't arrived
  if (isLoading || !caseData) {
    return (
      <div className="p-2 text-sm text-muted-foreground animate-pulse">
        Loading matters...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-2 text-sm text-destructive">Error loading matters.</div>
    );
  }

  // Safely extract the array from your API response structure
  const mattersList = caseData.data || [];

  return (
    <Combobox
      value={value}
      // 2. Fixed: 'val' from the combobox is typically the selected string value directly
      onValueChange={(val) => {
        if (onChange) onChange(val);
      }}
    >
      <ComboboxInput placeholder="Select a matter" />
      <ComboboxContent className="pointer-events-auto">
        {mattersList.length === 0 ? (
          <ComboboxEmpty>No items found.</ComboboxEmpty>
        ) : (
          <ComboboxList>
            {mattersList.map((item: any) => {
              return (
                <ComboboxItem
                  key={item.title}
                  value={item.title}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {item.title}
                </ComboboxItem>
              );
            })}
          </ComboboxList>
        )}
      </ComboboxContent>
    </Combobox>
  );
}
