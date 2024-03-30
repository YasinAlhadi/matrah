import { getAuth, updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../../firebase.config'
import { doc, updateDoc } from 'firebase/firestore'

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [editProfile, setEditProfile] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const { name, email } = formData
  function handleSignOut() {
    auth.signOut()
    navigate('/')
  }
  function handleChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  async function handleSave() {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        const docRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(docRef, {
          name
        })
      }
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while updating your profile")
    }
  }
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='mb-6 text-3xl text-center mt-6 font-bold'>Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form action="">
          <input type="text" id='name' value={name} disabled={!editProfile} onChange={handleChange} className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${editProfile && "bg-red-200 focus:bg-red-200"}`} />
          <input type="email" id='email' value={email} disabled={!editProfile} onChange={handleChange} className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out' />
          <div onClick={() => {
            editProfile && handleSave();
            setEditProfile((prevState) => !prevState);
          }} className='text-center cursor-pointer mb-6 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition duration-150 ease-out'>
            {editProfile ? 'Save' : 'Edit Profile'}
          </div>
          <button onClick={handleSignOut} className='w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition duration-150 ease-out' type='button'>Sign Out</button>

        </form>
      </div>
    </section>
    </>
  )
}

export default Profile