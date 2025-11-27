import React, { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
export default function Toast() {
  const queue = useUIStore((s) => s.toastQueue)
  const shift = useUIStore((s) => s.shiftToast)
  useEffect(() => {
    if (queue.length > 0) {
      const t = setTimeout(() => {
        shift()
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [queue, shift])
  if (queue.length === 0) return null
  const current = queue[0]
  const color = current.type === 'error' ? 'bg-red-600' : 'bg-green-600'
  return (
    <div className='fixed bottom-6 right-6'>
      <div className={`${color} text-white px-4 py-2 rounded shadow`}>{current.message}</div>
    </div>
  )
}
