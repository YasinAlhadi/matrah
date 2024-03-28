import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth';

function ForgetPass() {
  const [formData, setFormData] = useState({
    email: '',
  })
  const { email } = formData
  function handleChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign In</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJ1aWxkaW5nfGVufDB8fDB8fHww" alt="sign-in" className='w-full rounded-2xl' />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form>
            <p className='text-lg text-gray-700 mb-6'>Enter your email address and we will send you a link to reset your password.</p>
            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-6' type="email" id='email' value={email} onChange={handleChange} placeholder='Email Address' />
            <div className='text-sm sm:text-lg'>
              <p className='mb-6'>Back to <Link to="/sign-in" className='text-red-500 hover:text-red-700 ml-1'>Sign in</Link></p>
            </div>
            <button className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition duration-150 ease-out' type='submit'>Send reset password</button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-400 after:border-t after:flex-1 after:border-gray-400'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  )
}

export default ForgetPass