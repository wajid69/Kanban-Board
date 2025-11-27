import React, { useState } from 'react'
import { useUIStore } from '../store/uiStore'
import { useDeleteTask } from '../api/tasks'
import { toast } from 'react-toastify'

export default React.memo(function TaskCard({ task, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const setDragging = useUIStore((s) => s.setDragging)
  const del = useDeleteTask()

  // Handle Drag Start
  function handleDragStart(e) {
    setDragging(task)
    e.dataTransfer.setData('application/json', JSON.stringify({ task }))
    e.dataTransfer.effectAllowed = 'move'
  }
  // Handle Delete
  function handleDelete() {
    del.mutate(task.id)
  }
  // Handle Edit
  function handleEdit() {
    setIsEditing(true)
    setTimeout(() => {
      onEdit()
      setIsEditing(false)
    }, 100)
  }
  return (
    <div draggable onDragStart={handleDragStart} className='border p-3 rounded bg-gray-50 hover:bg-gray-100 cursor-move hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='font-semibold text-gray-800'>{task.title}</div>
          <div className='text-sm text-gray-600 mt-1'>{task.description}</div>
        </div>
        <div className='ml-3 flex flex-col gap-2'>
          <button 
            onClick={handleEdit} 
            disabled={isEditing}
            className='text-xs bg-black text-white px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1'
          >
            {isEditing && (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Edit
          </button>
          <button 
            onClick={handleDelete} 
            disabled={del.isLoading}
            className='text-xs bg-orange-red text-white px-2 py-1 rounded disabled:opacity-50 flex items-center gap-1'
          >
            {del.isLoading && (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
})
