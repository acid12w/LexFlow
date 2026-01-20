import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Ghost, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface breadcrumbProps {
  data: string;
}

interface BreadcrumbWithCustomSeparatorProps {
  pathnameProps: string;
}

export function BreadcrumbWithCustomSeparator({
  pathnameProps,
}: BreadcrumbWithCustomSeparatorProps) {
  const pathArr = pathnameProps.split("/");
  const cleanedPathnameArray = pathArr
    ?.map((str) => str.replace(/\d+/g, ""))
    .filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {cleanedPathnameArray.length > 0 && <BreadcrumbSeparator />}
        {cleanedPathnameArray.map((pathname, index) => {
          const isLast = index === cleanedPathnameArray.length - 1;

          if (isLast) {
            return (
              <React.Fragment key={pathname}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Button onClick={() => {}} variant={"link"}>
                      {pathname}
                    </Button>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={"/" + pathname}>{pathname}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
