"use client"

import { CheckCircle } from "lucide-react"

export default function SuccessPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
          <p className="text-xl font-semibold text-center">{message}</p>
          <button onClick={onClose} className="px-6 py-2 text-white bg-orange-500 rounded hover:bg-orange-600">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

