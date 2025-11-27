import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './axios'
import { toast } from 'react-toastify'
const STORAGE_KEY = 'kanban_tasks_v1'

// Fetch Tasks
export function useFetchTasks() {
  return useQuery(['tasks'], async () => {
    const res = await api.get('/v1/tasks')
    return res.data
  }, {
    onError: () => {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          return JSON.parse(raw)
        } catch {
          return []
        }
      }
      return []
    },
    onSuccess: (data) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {}
    },
    staleTime: 10000
  })
}
// Create Task
export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation(async (payload) => {
    const res = await api.post('/v1/tasks', payload)
    return res.data
  }, {
    onSuccess: (data) => {
      qc.invalidateQueries(['tasks'])
      toast.success('Task created successfully')
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const arr = raw ? JSON.parse(raw) : []
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...arr, data]))
      } catch {}
    },
    onError: () => {
      toast.error('Failed to create task')
    }
  })
}
// Update Task
export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation(async ({ id, payload }) => {
    const res = await api.put(`/v1/tasks/${id}`, payload)
    return res.data
  }, {
    onSuccess: (data) => {
      qc.invalidateQueries(['tasks'])
      toast.success('Task updated successfully')
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const arr = raw ? JSON.parse(raw) : []
        const updated = arr.map(t => t.id === data.id ? data : t)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
    },
    onError: () => {
      toast.error('Failed to update task')
    }
  })
}

// Delete Task
export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation(async (id) => {
    await api.delete(`/v1/tasks/${id}`)
    return id
  }, {
    onSuccess: (id) => {
      qc.invalidateQueries(['tasks'])
      toast.success('Task deleted successfully')
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const arr = raw ? JSON.parse(raw) : []
        const updated = arr.filter(t => t.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
    },
    onError: () => {
      toast.error('Failed to delete task')
    }
  })
}
