import { api } from "@/app/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetActivityLog() {
  const result = useQuery({
    queryKey: ["Activity"],
    queryFn: () => api.get(`/activity`),
  });
  return result;
}
export function useGetCasesOverview() {
  const result = useQuery({
    queryKey: ["FirmActive"],
    queryFn: () => api.get("dashboard/cases-overview"),
  });
  return result;
}

export function useGetTotalRevenue() {
  const result = useQuery({
    queryKey: ["totalRevenue"],
    queryFn: () => api.get(`dashboard/revenue-total`),
  });
  return result;
}

export function useGetCollectedRevenue() {
  const result = useQuery({
    queryKey: ["collectedRevenue"],
    queryFn: () => api.get(`dashboard/revenue-collected`),
  });
  return result;
}

export function useGetSnapShot() {
  const result = useQuery({
    queryKey: ["snapshot"],
    queryFn: () => api.get(`dashboard/revenue-snapshot`),
  });
  return result;
}
