import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface DateStripProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

function DateStrip({ selectedDate, onDateChange }: DateStripProps) {
  const [centerDate, setCenterDate] = useState(selectedDate)

  // Generate surrounding weeks based on centerDate (e.g. 5 weeks roughly surrounding it)
  const weeks = useMemo(() => {
    const result: Date[] = []
    
    // Find the Monday of the current centerDate week
    const startOfCenterWeek = new Date(centerDate)
    const day = startOfCenterWeek.getDay()
    const diff = startOfCenterWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfCenterWeek.setDate(diff)
    
    // Generate 5 weeks: 2 before, current, 2 after
    for (let i = -2; i <= 2; i++) {
      const d = new Date(startOfCenterWeek)
      d.setDate(startOfCenterWeek.getDate() + (i * 7))
      result.push(d)
    }
    return result
  }, [centerDate])

  // Helper to check if two dates fall in the same week (assuming Monday start)
  const isSameWeek = (date1: Date, date2: Date) => {
    const d1 = new Date(date1)
    const day1 = d1.getDay()
    d1.setDate(d1.getDate() - day1 + (day1 === 0 ? -6 : 1))
    d1.setHours(0, 0, 0, 0)
    
    const d2 = new Date(date2)
    const day2 = d2.getDay()
    d2.setDate(d2.getDate() - day2 + (day2 === 0 ? -6 : 1))
    d2.setHours(0, 0, 0, 0)
    
    return d1.getTime() === d2.getTime()
  }

  const isCurrentWeek = (d: Date) => isSameWeek(d, new Date())

  const handlePrev = () => {
    const newCenter = new Date(centerDate)
    newCenter.setDate(centerDate.getDate() - 7)
    setCenterDate(newCenter)
  }

  const handleNext = () => {
    const newCenter = new Date(centerDate)
    newCenter.setDate(centerDate.getDate() + 7)
    setCenterDate(newCenter)
  }

  const handleWeekClick = (d: Date) => {
    onDateChange(d)
  }

  const formatWeekRange = (startOfWeek: Date) => {
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const startMonth = startOfWeek.toLocaleString('fr-FR', { month: 'short' })
    const endMonth = endOfWeek.toLocaleString('fr-FR', { month: 'short' })
    
    if (startMonth === endMonth) {
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startMonth}`
    }
    return `${startOfWeek.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth}`
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
      
      <button
        onClick={handlePrev}
        className="btn btn-circle btn-ghost btn-sm shrink-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2 flex-1 justify-center overflow-x-auto">
        {weeks.map((weekStart) => {
          const selected = isSameWeek(weekStart, selectedDate)
          const current = isCurrentWeek(weekStart)
          
          return (
            <button
              key={weekStart.toISOString()}
              onClick={() => handleWeekClick(weekStart)}
              className={`
                px-4 py-2 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-all gap-2
                ${selected ? 'bg-primary-900 text-white shadow-md' : ''}
                ${current && !selected ? 'border-2 border-primary-500 text-primary-700' : ''}
                ${!selected && !current ? 'text-gray-500 hover:bg-gray-100' : ''}
              `}
            >
              <CalendarIcon className="w-4 h-4" />
              {formatWeekRange(weekStart)}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        className="btn btn-circle btn-ghost btn-sm shrink-0"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default DateStrip
