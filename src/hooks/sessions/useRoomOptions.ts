import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useRoomService } from '@/services/roomService'

export function useRoomOptions(enabled = true) {
  const { getRooms } = useRoomService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    if (!enabled) {
      setOptions([])
      return
    }

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
  }, [enabled, getRooms])

  return options
}
