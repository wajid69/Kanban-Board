import React from 'react'

export default function Loader() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative w-16 h-16'>
          <div className='absolute inset-0 rounded-full border-4 border-gray-200'></div>
          <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin'></div>
        </div>
      </div>
    </div>
  )
}
