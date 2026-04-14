import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useProgramService } from '@/services/programService'

/** Filières = API Programs (`/Programs`) */
export function useFiliereOptions() {
  const { getPrograms } = useProgramService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    getPrograms()
      .then((programs) => {
        setOptions(
          programs
            .map((p) => ({ value: p.id, label: p.name }))
            .sort((a, b) => a.label.localeCompare(b.label, 'fr')),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [getPrograms])

  return options
}
