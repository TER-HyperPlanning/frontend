import { useEffect, useState } from "react";
import { useAppClient } from "@/hooks/api/useAppClient";

type Track = {
  id: string;
  name: string;
};

type ApiResponse<T> = {
  status: string;
  message: string;
  result: T;
};

export function useTracks() {
  const { api } = useAppClient();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await api.get<ApiResponse<Track[]>>("/Tracks");
        setTracks(res.data.result);
      } catch (e) {
        console.error(e);
      }
    }

    fetchTracks();
  }, [api]);

  return { tracks };
}