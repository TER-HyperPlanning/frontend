import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface RejectReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
}

export default function RejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
}: RejectReasonModalProps) {
  const [reason, setReason] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (isOpen) setReason('')
  }, [isOpen])

  // 🔥 auto resize textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value)

    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-gray-200 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Motif du refus
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Veuillez expliquer brièvement pourquoi cette demande est refusée.
        </p>

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={handleChange}
          placeholder="Ex: Salle indisponible, conflit de planning..."
          className="w-full border border-gray-300 bg-white/95 text-gray-800 placeholder:text-gray-400 rounded-2xl p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition resize-none text-sm overflow-hidden min-h-[120px] max-h-[300px]"
        />

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            Annuler
          </button>

          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason.trim())
              onClose()
            }}
            className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition ${
              reason.trim()
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 shadow-md'
                : 'bg-red-300 cursor-not-allowed'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}