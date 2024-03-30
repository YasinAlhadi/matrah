import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStatus } from '../hooks/useAuthStatus'

function PrivuteRoute() {
    const { loggedIn, checking } = useAuthStatus()
    if (checking) {
        return <div>Loading...</div>
    }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivuteRoute