import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useCourseService } from '@/services/courseService'

export function useCourseOptions(enabled = true) {
  const { getCourses } = useCourseService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    if (!enabled) {
      setOptions([])
      return
    }

    getCourses()
      .then((courses) => {
        setOptions(
          courses.map((c) => ({
            value: c.id,
            label: `${c.name} (${c.code})`,
          })),
        )
      })
      .catch(() => {
        setOptions([])
      })
  }, [enabled, getCourses])

  return options
}
