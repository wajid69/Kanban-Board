import React, { useMemo, useState, useEffect } from 'react'
import Column from './Column'
import { DndContext, closestCenter, PointerSensor, TouchSensor, KeyboardSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import TaskModal from './TaskModal'
import TaskCard from './TaskCard'
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

  
  const columns = useMemo(() => ([
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ]), [])
  
  const grouped = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = tasks.filter(t => t.status === col.id)
      return acc
    }, {})
  }, [tasks, columns])
  
  const [containers, setContainers] = useState(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = (grouped[col.id] || []).map(t => t.id)
      return acc
    }, {})
  })

  useEffect(() => {
    setContainers(columns.reduce((acc, col) => {
      acc[col.id] = (grouped[col.id] || []).map(t => t.id)
      return acc
    }, {}))
  }, [tasks, columns])

  
  const [activeId, setActiveId] = useState(null)

  
  const sensors = useSensors(
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function findContainer(id) {
    for (const col of Object.keys(containers)) {
      if (containers[col].includes(id)) return col
    }
    return null
  }

  
  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return
    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId) || (Object.keys(containers).includes(overId) ? overId : null)
    if (!activeContainer || !overContainer) return

    if (activeContainer !== overContainer) {
      setContainers(prev => {
        const next = { ...prev }
        
        next[activeContainer] = next[activeContainer].filter(i => i !== activeId)
        
        if (Object.keys(prev).includes(overId)) {
          next[overId] = [...next[overId], activeId]
        } else {
          
          const idx = next[overContainer].indexOf(overId)
          const arr = [...next[overContainer]]
          arr.splice(idx + 0, 0, activeId)
          next[overContainer] = arr
        }
        return next
      })
    } else {
      
      setContainers(prev => {
        const next = { ...prev }
        const items = [...next[activeContainer]]
        const oldIndex = items.indexOf(activeId)
        const newIndex = items.indexOf(overId)
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          next[activeContainer] = arrayMove(items, oldIndex, newIndex)
        }
        return next
      })
    }
  }

  const [startContainer, setStartContainer] = useState(null)
  function handleDragStart(event) {
    const id = event.active.id
    setActiveId(id)
    const taskObj = tasks.find(t => t.id === id)
    setDragging(taskObj || null)
    setStartContainer(findContainer(id))
  }

  function handleDragCancel() {
    setActiveId(null)
    setDragging(null)
    
    setContainers(columns.reduce((acc, col) => {
      acc[col.id] = (grouped[col.id] || []).map(t => t.id)
      return acc
    }, {}))
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    setDragging(null)
    if (!over) {
      
      setContainers(columns.reduce((acc, col) => {
        acc[col.id] = (grouped[col.id] || []).map(t => t.id)
        return acc
      }, {}))
      return
    }

    const activeId = active.id
    const currentContainer = findContainer(activeId)
    const from = startContainer
    const to = currentContainer
    if (!from || !to) {
      setContainers(columns.reduce((acc, col) => {
        acc[col.id] = (grouped[col.id] || []).map(t => t.id)
        return acc
      }, {}))
      return
    }
    if (from !== to) {
      const taskObj = tasks.find(t => t.id === activeId)
      if (taskObj) update.mutate({ id: taskObj.id, payload: { status: to } })
    }
    setStartContainer(null)

    
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {columns.map(col => {
            
            const ids = containers[col.id] || []
            const items = ids.map(id => tasks.find(t => t.id === id)).filter(Boolean)
            return (
              <SortableContext key={col.id} id={col.id} items={ids} strategy={verticalListSortingStrategy}>
                <Column key={col.id} id={col.id} title={col.title} tasks={items} onEdit={(t) => { setEditing(t); setModalOpen(true) }} />
              </SortableContext>
            )
          })}
        </div>

        <DragOverlay>{activeId ? <TaskCard task={tasks.find(t => t.id === activeId)} /> : null}</DragOverlay>
      </DndContext>
      <TaskModal open={modalOpen} close={() => setModalOpen(false)} editing={editing} />
    </div>
  )
})
