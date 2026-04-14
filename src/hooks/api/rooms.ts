import { useCallback } from "react";
import { useAppClient } from "@/hooks/api/useAppClient";

export type Room = {
  isDeleted: any;
  roomId: string;
  roomNumber: string;
  capacity: number;
  isAvailable: boolean;
  buildingId: string;
  type: "TD" | "COURS" | "INFO" | "AMPHITHEATRE";
};

export type RoomRequest = {
  roomId?: string;
  roomNumber: string;
  capacity: number;
  isAvailable: boolean;
  buildingId: string;
  type: "TD" | "COURS" | "INFO" | "AMPHITHEATRE";
};

type ApiResponse<T> = {
  status: string;
  message: string;
  result: T;
};

export function useRoomService() {
  const { api } = useAppClient();

  const getRooms = useCallback(
    (params?: { q?: string; types?: string[] }) =>
      api
        .get<ApiResponse<Array<Room>>>("/Room", {
          params: {
            q: params?.q,
            types: params?.types?.join(","),
          },
        })
        .then(r => r.data.result),
    [api]
  );
  const createRoom = useCallback(
    (data: RoomRequest) =>
      api.post<ApiResponse<Room>>("/Room", data)
        .then(r => r.data),
    [api]
  );

  const updateRoom = useCallback(
    (id: string, data: RoomRequest) =>
      api.put<ApiResponse<Room>>(`/Room/${id}`, data)
        .then(r => r.data),
    [api]
  );

  const deleteRoom = useCallback(
    async (id: string) => {
      const res = await api.delete<ApiResponse<string>>(`/Room/${id}`);
      return res.data;
    },
    [api]
  );

  return { getRooms, createRoom, updateRoom, deleteRoom };
}