"use client";

import * as React from "react";
import { ComboboxDemo } from "../combo-box/comboBox";

interface AssignUserProps {
  openState: boolean;
  value?: string[];
  onChange: (assigneeIds: any) => void;
}

export function AssignUser({
  onChange,
  openState,
  value = [],
}: AssignUserProps) {
  const [open, setOpen] = React.useState(openState);

  React.useEffect(() => {
    setOpen(openState);
  }, [openState]);

  return (
    <div className="flex flex-col gap-8 justify-end absolute right-0 top-12">
      <ComboboxDemo
        value={value}
        onChange={onChange}
        placeholder="Select members..."
        className="w-[250px]"
      />
    </div>
  );
}
