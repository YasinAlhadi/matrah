import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Spinner from './Spinner'

function PrivuteRoute() {
    const { loggedIn, checking } = useAuthStatus()
    if (checking) {
        return <Spinner />
    }
  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivuteRoute