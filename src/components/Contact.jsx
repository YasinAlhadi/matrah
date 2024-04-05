import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase.config'
import { toast } from 'react-toastify'

export default function Contact({ userRef, listing }) {
    const [owner, setOwner] = useState(null)
    const [message, setMessage] = useState('')
    useEffect(() => {
        async function fetchUser() {
            const docRef = doc(db, 'users', userRef)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setOwner(docSnap.data())
            } else {
                toast.error('Not found owner contact info')
            }
        }
        fetchUser()
    }, [userRef])

    function onChange(e) {
        setMessage(e.target.value)
    }
  return (
    <>
        {owner !== null && (
            <div className='flex flex-col'>
                <p>Contact {owner.name} for {listing.name}</p>
                <div>
                  <textarea name="message" id="message" rows="2" value={message} onChange={onChange} className='w-full mt-2 rounded border-gray-600'></textarea>
              </div>
              <a href={`mailto:${owner.email}?Subject=${listing.name}&body=${message}`}>
                <button className='px-7 py-3 bg-blue-700 text-white text-sm shadow-md uppercase font-medium hover:bg-blue-900 w-full mt-2'>Send Message</button>
              </a>
            </div>
        )}
    </>
  )
}
