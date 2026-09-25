export function formatStatus(status: string): string {
  if (!status) return "";
  if (status === status.toLowerCase()) {
    return status;
  }

  const lowerWithSpaces = status.replace(/_/g, " ").toLowerCase();
  return lowerWithSpaces.charAt(0).toUpperCase() + lowerWithSpaces.slice(1);
}

export const getInitials = (firstName: string, lastName?: string) => {
  const firstInitial = firstName?.[0] ?? "";
  const lastInitial = lastName?.[0] ?? "";
  return `${firstInitial}${lastInitial}`.toUpperCase() || "CL";
};
