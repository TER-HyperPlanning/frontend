import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useTrackService } from '@/services/trackService'

export function useTrackOptions() {
  const { getTracks } = useTrackService()
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
  }, [getTracks])

  return options
}
