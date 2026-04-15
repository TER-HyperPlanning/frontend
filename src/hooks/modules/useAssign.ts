import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppClient } from "@/hooks/api/useAppClient";

type Assign = {
  trackId: string;
  courseId: string;
  hourlyVolume: number;
};

type ApiResponse<T> = {
  status: string;
  message: string;
  result: T;
};

type CreateAssignPayload = {
  trackId: string;
  courseId: string;
  hourlyVolume: number;
};

type UpdateAssignPayload = {
  trackId: string;
  courseId: string;
  hourlyVolume: number;
};

type DeleteAssignPayload = {
  trackId: string;
  courseId: string;
};

export function useAssign() {
  const { api } = useAppClient();
  const queryClient = useQueryClient();

  const assignsQuery = useQuery({
    queryKey: ["assigns"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Assign[]>>("/Assign");
      return response.data.result;
    },
  });

  const createAssignMutation = useMutation({
    mutationFn: async (payload: CreateAssignPayload) => {
      const response = await api.post<ApiResponse<boolean>>("/Assign", payload);
      return response.data.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigns"] });
    },
  });

  const updateAssignMutation = useMutation({
    mutationFn: async ({ trackId, courseId, hourlyVolume }: UpdateAssignPayload) => {
      const response = await api.put<ApiResponse<boolean>>(
        `/Assign/${trackId}/${courseId}`,
        { hourlyVolume }
      );
      return response.data.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigns"] });
    },
  });

  const deleteAssignMutation = useMutation({
    mutationFn: async ({ trackId, courseId }: DeleteAssignPayload) => {
      const response = await api.delete<ApiResponse<boolean>>(
        `/Assign/${trackId}/${courseId}`
      );
      return response.data.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigns"] });
    },
  });

  return {
    assigns: assignsQuery.data ?? [],
    isLoading: assignsQuery.isLoading,
    isError: assignsQuery.isError,
    error: assignsQuery.error,

    createAssign: createAssignMutation.mutateAsync,
    updateAssign: updateAssignMutation.mutateAsync,
    deleteAssign: deleteAssignMutation.mutateAsync,
  };
}