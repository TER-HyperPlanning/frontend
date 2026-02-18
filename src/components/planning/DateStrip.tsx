import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateStripProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

function DateStrip({ selectedDate, onDateChange }: DateStripProps) {
  const [centerDate, setCenterDate] = useState(selectedDate)

  // Generate an array of ~14 days centered around centerDate
  const days = useMemo(() => {
    const result: Date[] = []
    for (let i = -6; i <= 7; i++) {
      const d = new Date(centerDate)
      d.setDate(centerDate.getDate() + i)
      result.push(d)
    }
    return result
  }, [centerDate])

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const isToday = (d: Date) => isSameDay(d, new Date())

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

  const handleDayClick = (d: Date) => {
    onDateChange(d)
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto">
      <button
        onClick={handlePrev}
        className="btn btn-circle btn-ghost btn-sm flex-shrink-0"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 flex-1 justify-center overflow-x-auto">
        {days.map((d) => {
          const selected = isSameDay(d, selectedDate)
          const today = isToday(d)
          return (
            <button
              key={d.toISOString()}
              onClick={() => handleDayClick(d)}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all
                ${selected ? 'bg-primary-900 text-white shadow-md' : ''}
                ${today && !selected ? 'border-2 border-primary-500 text-primary-700' : ''}
                ${!selected && !today ? 'text-gray-500 hover:bg-gray-100' : ''}
              `}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        className="btn btn-circle btn-ghost btn-sm flex-shrink-0"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default DateStrip
