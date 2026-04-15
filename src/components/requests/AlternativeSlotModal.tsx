import { useState } from 'react'

interface Slot {
  date: string
  start: string
  end: string
  room: string
  typeRoom: string
  building: string
}

interface AlternativeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (slot: Slot) => void
}

export default function AlternativeSlotModal({
  isOpen,
  onClose,
  onConfirm,
}: AlternativeSlotModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // ✅ AJOUT : plage horaire personnalisée
  const [startRange, setStartRange] = useState('')
  const [endRange, setEndRange] = useState('')

  if (!isOpen) return null

  const now = new Date()
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  // Exemple de créneaux
  const slots: Slot[] = [
    { date: '10/03/2026', start: '10:00', end: '12:00', room: '201', typeRoom:'Informatique', building: 'A' },
    { date: '11/03/2026', start: '14:00', end: '16:00', room: '105', typeRoom:'Amphitheatre', building: 'B' },
    { date: '12/03/2026', start: '08:00', end: '10:00', room: '302', typeRoom:'Informatique', building: 'C' },
  ]

  const isRangeValid =
    startRange &&
    endRange &&
    new Date(startRange) < new Date(endRange)

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-[#003A68] mb-4">
          Proposer un créneau alternatif
        </h3>

        <p className="mb-4 text-gray-600">
          Sélectionnez un créneau disponible pour la récupération de cette séance :
        </p>

        {/* ✅ AJOUT : sélection plage horaire */}
        <div className="mb-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Début de plage</label>
            <input
              type="datetime-local"
              value={startRange}
              min={minDateTime}
              onChange={(e) => setStartRange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Fin de plage</label>
            <input
              type="datetime-local"
              value={endRange}
              min={startRange || minDateTime}
              onChange={(e) => setEndRange(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2 mt-1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {slots.map((slot, index) => {
            const isSelected =
              selectedSlot?.date === slot.date &&
              selectedSlot?.start === slot.start

            return (
              <div
                key={index}
                onClick={() => setSelectedSlot(slot)}
                className={`cursor-pointer p-4 rounded-xl border flex justify-between ${
                  isSelected
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  <p className="font-semibold">{slot.date}</p>
                  <p>{slot.start} - {slot.end}</p>
                  <p>
                    Salle {slot.room} <br />
                    Type: {slot.typeRoom} <br />
                    Batiment: {slot.building}
                  </p>
                </div>

                {isSelected && (
                  <span className="text-blue-600 text-xl font-bold">✓</span>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            disabled={!selectedSlot || !isRangeValid}
            onClick={() => selectedSlot && onConfirm(selectedSlot)}
            className={`flex-1 py-2 rounded-xl text-white ${
              selectedSlot && isRangeValid
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Confirmer le créneau alternatif
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}