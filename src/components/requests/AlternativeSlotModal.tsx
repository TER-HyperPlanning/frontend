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

  if (!isOpen) return null

  // Exemple de créneaux
  const slots: Slot[] = [
    { date: '10/03/2026', start: '10:00', end: '12:00', room: '201', typeRoom:'Informatique', building: 'A' },
    { date: '11/03/2026', start: '14:00', end: '16:00', room: '105', typeRoom:'Amphitheatre', building: 'B' },
    { date: '12/03/2026', start: '08:00', end: '10:00', room: '302', typeRoom:'Informatique', building: 'C' },
  ]

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
                  <p>Salle {slot.room} <br />Type: {slot.typeRoom} <br />Batiment: {slot.building}</p>
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
            disabled={!selectedSlot}
            onClick={() => selectedSlot && onConfirm(selectedSlot)}
            className={`flex-1 py-2 rounded-xl text-white ${
              selectedSlot
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