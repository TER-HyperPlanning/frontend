import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useGroupService } from '@/services/groupService'

export function useGroupOptions() {
  const { getGroups } = useGroupService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    getGroups()
      .then((groups) => {
        setOptions(
          groups.map((g) => ({
            value: g.id,
            label: g.name,
          })),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [getGroups])

  return options
}
