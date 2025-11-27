import React, { useMemo, useState } from 'react'
import Column from './Column'
import TaskModal from './TaskModal'
import Loader from './Loader'
import { useFetchTasks, useUpdateTask, useCreateTask } from '../api/tasks'
import { useUIStore } from '../store/uiStore'
import { toast } from 'react-toastify'
export default React.memo(function Board() {
  const { data, isLoading, isError } = useFetchTasks()
  const update = useUpdateTask()
  const create = useCreateTask()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const setDragging = useUIStore((s) => s.setDragging)
  const isUpdating = update.isLoading
  const tasks = data || []

  // Memoized Columns 
  const columns = useMemo(() => ([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ]), [])
  // Group tasks by status
  const grouped = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = tasks.filter(t => t.status === col.id)
      return acc
    }, {})
  }, [tasks, columns])
  // Handle Drop
  function handleDrop(task, toStatus, toIndex) {
    if (!task) return
    const payload = { status: toStatus }
    update.mutate({ id: task.id, payload })
    setDragging(null)
  }
  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <div className='text-red-600'>Error loading tasks</div>
  }
  return (
    <div>
      <div className='mb-4 flex justify-between items-center'>
        <div>
          <button 
            onClick={() => { setEditing(null); setModalOpen(true) }} 
            disabled={create.isLoading}
            className='bg-black text-white px-3 py-1 rounded flex items-center gap-2 disabled:opacity-50'
          >
            {create.isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            New Task
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {columns.map(col => (
          <Column key={col.id} id={col.id} title={col.title} tasks={grouped[col.id] || []} onDrop={handleDrop} onEdit={(t) => { setEditing(t); setModalOpen(true) }} />
        ))}
      </div>
      <TaskModal open={modalOpen} close={() => setModalOpen(false)} editing={editing} />
    </div>
  )
})
