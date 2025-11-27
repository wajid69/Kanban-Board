import React, { useRef } from 'react'
import TaskCard from './TaskCard'
import { useUIStore } from '../store/uiStore'
import { useDroppable } from '@dnd-kit/core'

export default React.memo(function Column({ id, title, tasks, onEdit }) {
  const setDragging = useUIStore((s) => s.setDragging)
  const dragging = useUIStore((s) => s.dragging)
  const ref = useRef(null)

  const { isOver, setNodeRef } = useDroppable({ id })
  function combinedRef(node) {
    ref.current = node
    setNodeRef(node)
  }

  return (
    <div ref={combinedRef} className={`bg-white rounded shadow p-3 min-h-[200px] hover:ring-2 hover:ring-blue-200 transition-all ${isOver ? 'col-drop-target' : ''}`}>
      <h2 className='text-lg font-medium mb-2'>{title}</h2>
      <div className='space-y-2'>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={() => onEdit(task)} />
        ))}
      </div>
      {tasks.length === 0 && <div className='text-sm text-gray-400 mt-3'>No tasks</div>}
    </div>
  )
})
