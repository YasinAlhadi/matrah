import React from 'react'

export default function Skeleton() {
  return (
    <div className='animate-pulse flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
      <div className='contents'>
        <div className='h-[170px] w-full bg-gray-300 animate-pulse'></div>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <div className='h-4 w-4 bg-gray-300 animate-pulse'></div>
            <div className='font-semibold text-sm mb-[2px] text-gray-600 truncate bg-gray-300 animate-pulse'></div>
          </div>
          <div className='font-semibold text-xl truncate bg-gray-300 animate-pulse'></div>
          <div className='font-semibold mt-2 text-fuchsia-900 bg-gray-300 animate-pulse'></div>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <div className='font-bold text-sm bg-gray-300 animate-pulse'></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className='font-bold text-sm bg-gray-300 animate-pulse'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
