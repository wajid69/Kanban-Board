import React from 'react'
import Board from './components/Board'
export default React.memo(function App() {
  return (
    <div className='min-h-screen bg-gray-100 p-4'>
      <div className='max-w-7xl mx-auto'>
        <header className='mb-6'>
          <h1 className='text-2xl font-semibold text-gray-800'>Kanban Board</h1>
        </header>
        <Board />
      </div>
    </div>
  )
})
