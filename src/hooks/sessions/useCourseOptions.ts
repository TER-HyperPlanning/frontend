import { useState, useEffect } from 'react'
import { type SelectOption } from '@/types/formation'
import { useCourseService } from '@/services/courseService'

export function useCourseOptions() {
  const { getCourses } = useCourseService()
  const [options, setOptions] = useState<SelectOption[]>([])

  useEffect(() => {
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
  }, [getCourses])

  return options
}
