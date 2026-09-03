import { api } from "@/app/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetActivityLog() {
  const result = useQuery({
    queryKey: ["Activity"],
    queryFn: () => api.get(`/activity/firm`),
  });
  return result;
}

export function useGetUserActivityLog() {
  const result = useQuery({
    queryKey: ["Activity"],
    queryFn: () => api.get(`/activity/user`),
  });
  return result;
}
