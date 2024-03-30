import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
            }
            setChecking(false)
        })
    }, [])
            
  return { loggedIn, checking }
}
