import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Header() {
    const [pageState, setPageState] = useState('Sign In')
    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState('Profile')
            } else {
                setPageState('Sign In')
            }
        })
    }, [auth])
    function matchRoute(route) {
        if (route == location.pathname) return true
    }
  return (
   <>
    <div className='bg-white border-b shadow-sm sticky top-0 z-30'>  
    <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
           <img src='logo.png' alt='logo' className='h-10 cursor-pointer' onClick={() => navigate("/")} />
        </div>
        <div>
            <ul className='flex space-x-10'>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${matchRoute("/") && "text-black border-b-red-500"}`} onClick={() => navigate("/")}>Home</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${matchRoute("/offers") && "text-black border-b-red-500"}`} onClick={() => navigate("/offers")}>Offers</li>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(matchRoute("/sign-in") || matchRoute("/profile")) && "text-black border-b-red-500"}`} onClick={() => navigate("/profile")}>
                    {pageState}
                </li>
            </ul>
        </div>
    </header>
    </div>
   </>
  )
}

export default Header