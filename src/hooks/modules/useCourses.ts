import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppClient } from '@/hooks/api/useAppClient'

type Course = {
  id: string
  name: string
  code: string
}

type ApiResponse<T> = {
  status: string
  message: string
  result: T
}

type CreateCoursePayload = {
  name: string
  code: string
}

type UpdateCoursePayload = {
  id: string
  data: {
    name: string
    code: string
  }
}

export function useCourses() {
  const { api } = useAppClient()
  const queryClient = useQueryClient()

  const coursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Course[]>>('/Courses')
      return response.data.result
    },
  })

  const createCourseMutation = useMutation({
    mutationFn: async (payload: CreateCoursePayload) => {
      const response = await api.post<ApiResponse<Course>>('/Courses', payload)
      return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateCoursePayload) => {
      const response = await api.put<ApiResponse<Course>>(`/Courses/${id}`, data)
      return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<string>>(`/Courses/${id}`)
      return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  return {
    courses: coursesQuery.data ?? [],
    isLoading: coursesQuery.isLoading,
    isError: coursesQuery.isError,
    error: coursesQuery.error,

    createCourse: createCourseMutation.mutateAsync,
    updateCourse: updateCourseMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,

    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
  }
}