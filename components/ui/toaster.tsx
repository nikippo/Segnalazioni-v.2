"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md flex items-start justify-between ${
            toast.variant === "destructive" ? "bg-red-100 text-red-900" : "bg-white text-gray-900"
          }`}
        >
          <div>
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
