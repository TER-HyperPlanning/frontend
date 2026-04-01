import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { getTracks } from '@/services/trackService'

export function useTrackOptions() {
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    getTracks()
      .then((tracks) => {
        setOptions(
          tracks.map((t) => ({
            value: t.id,
            label: t.name,
          })),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [])

  return options
}
