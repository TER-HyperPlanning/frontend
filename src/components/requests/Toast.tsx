import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' 
    ? 'bg-green-100' 
    : 'bg-red-100'
  const textColor = type === 'success' 
    ? 'text-green-800' 
    : 'text-red-800'
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div
      className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <div className={`${bgColor} ${textColor} px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px] border border-gray-200`}>
        <Icon className="w-5 h-5" />
        <span className="flex-1">{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="opacity-70 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>
    </div>
  )
}