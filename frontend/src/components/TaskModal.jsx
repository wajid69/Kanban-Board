import React, { useEffect, useState } from 'react'
import { useCreateTask, useUpdateTask } from '../api/tasks'
export default React.memo(function TaskModal({ open, close, editing }) {
  const create = useCreateTask()
  const update = useUpdateTask()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const isLoading = create.isLoading || update.isLoading
  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '')
      setDescription(editing.description || '')
      setStatus(editing.status || 'todo')
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
    }
  }, [editing, open])
  if (!open) return null

  // Handle Submit
  function handleSubmit(e) {
    e.preventDefault()
    const payload = { title, description, status }
    if (editing && editing.id) {
      update.mutate({ id: editing.id, payload }, {
        onSuccess: () => close()
      })
    } else {
      create.mutate(payload, {
        onSuccess: () => close()
      })
    }
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <form onSubmit={handleSubmit} className='bg-white rounded p-4 w-full max-w-md'>
        <h3 className='text-lg font-medium mb-3'>{editing ? 'Edit Task' : 'New Task'}</h3>
        <div className='mb-2'>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className='w-full border px-2 py-1 rounded' placeholder='Title' />
        </div>
        <div className='mb-2'>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className='w-full border px-2 py-1 rounded' placeholder='Description' />
        </div>
        <div className='mb-4'>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className='w-full border px-2 py-1 rounded'>
            <option value='todo'>To Do</option>
            <option value='in-progress'>In Progress</option>
            <option value='done'>Done</option>
          </select>
        </div>
        <div className='flex justify-end gap-2'>
          <button type='button' onClick={close} className='px-3 py-1 rounded border border-black text-black'>Cancel</button>
          <button type='submit' disabled={isLoading} className='px-3 py-1 rounded bg-black text-white disabled:opacity-50 flex items-center gap-2'>
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {editing ? 'Save' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
})
