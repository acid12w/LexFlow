import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatStatus } from "@/utils/formatStatus"; // Optional: Use your status string formatter!

interface BreadcrumbWithCustomSeparatorProps {
  pathnameProps: string; // Expects standard router path like "/dashboard/matters/123"
}

export function BreadcrumbWithCustomSeparator({
  pathnameProps,
}: BreadcrumbWithCustomSeparatorProps) {
  // Split path and filter out empty strings caused by trailing slashes
  const pathArr = pathnameProps.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathArr.map((segment, index) => {
          const isLast = index === pathArr.length - 1;

          // Crucial: Build the absolute path progressively segment by segment
          // Example: ['dashboard', 'matters'] -> "/dashboard" then "/dashboard/matters"
          const targetUrl = "/" + pathArr.slice(0, index + 1).join("/");

          // Format segment text cleanly (e.g., "matters" -> "Matters", "IN_REVIEW" -> "In review")
          const cleanLabel = segment.replace(/[-_]/g, " ");
          const formattedLabel =
            cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1);

          // If it's a MongoDB ObjectId or resource database ID, handle its display name safely
          const isIdString = segment.length >= 24 || /\d/.test(segment);
          const displayLabel = isIdString ? "Details" : formattedLabel;

          if (isLast) {
            return (
              <BreadcrumbItem key={targetUrl}>
                {/* The active location should be static text using BreadcrumbPage */}
                <BreadcrumbPage>{displayLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <React.Fragment key={targetUrl}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={targetUrl}>{displayLabel}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
