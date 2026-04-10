import { useEffect, useState, useRef } from 'react'
import { getSessionDetails } from '@/hooks/api/mock/sessionApi'
import type { SessionTooltipData } from '@/hooks/api/mock/sessionApi'

interface SessionTooltipProps {
  sessionId: string
  x: number
  y: number
}

export function SessionTooltip({ sessionId, x, y }: SessionTooltipProps) {
  const [data, setData] = useState<SessionTooltipData | null>(null)
  const [loading, setLoading] = useState(true)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true

    const fetchSessionDetails = async () => {
      try {
        setLoading(true)
        const details = await getSessionDetails(sessionId)
        if (mounted) {
          setData(details)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void fetchSessionDetails()

    return () => {
      mounted = false
    }
  }, [sessionId])

  if (loading) {
    return (
      <div
        ref={tooltipRef}
        className="fixed z-[100] min-w-[220px] rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        Chargement...
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[100] min-w-[260px] max-w-[320px] rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-900">{data.title}</p>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="inline-block h-4 w-4 rounded-full bg-blue-100" />
          {data.time}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-medium">Groupe :</span>
          <span>{data.group}</span>
        </div>

        {data.room && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">Salle :</span>
            <span>{data.room}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="font-medium">Enseignant :</span>
          <span>{data.teacherName}</span>
        </div>

      
      </div>
    </div>
  )
}