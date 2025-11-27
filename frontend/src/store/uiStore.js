import create from 'zustand'

// UI Store
export const useUIStore = create((set) => ({
  dragging: null,
  setDragging: (payload) => set({ dragging: payload }),
  toastQueue: [],
  pushToast: (toast) => set((state) => ({ toastQueue: [...state.toastQueue, toast] })),
  shiftToast: () => set((state) => ({ toastQueue: state.toastQueue.slice(1) }))
}))
