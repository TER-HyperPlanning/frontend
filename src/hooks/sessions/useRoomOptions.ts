import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useRoomService } from '@/services/roomService'

export function useRoomOptions() {
  const { getRooms } = useRoomService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    getRooms()
      .then((rooms) => {
        setOptions(
          rooms
            .filter((r) => r.isAvailable !== false)
            .map((r) => ({
              value: r.roomId,
              label: `${r.roomNumber} (cap. ${r.capacity})`,
            })),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [getRooms])

  return options
}
