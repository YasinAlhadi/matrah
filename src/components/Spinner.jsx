import React from 'react'
import loading from '../assets/svg/loading.svg'

export default function Spinner() {
  return (
    <>
    <div className='bg-opacity-50 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-40'>
        <img src={loading} alt="loading" />
    </div>
    </>
  )
}
