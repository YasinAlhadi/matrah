import { getAuth, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { db } from '../../firebase.config'
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import Skeleton from '../components/Skeleton'

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [editProfile, setEditProfile] = useState(false)
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
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
  useEffect(() => {
    async function userListings() {
      const q = query(collection(db, 'listings'), where('userRef', '==', auth.currentUser.uid), orderBy('timeStamp', 'desc'))
      const querySnapshot = await getDocs(q)
      const listings = []
      querySnapshot.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    userListings()
  }, [auth.currentUser.uid])
  async function onDelete(id) {
    const confirm = window.confirm("Are you sure you want to delete this listing?")
    if (confirm) {
      // Delete the listing
      try {
        await deleteDoc(doc(db, 'listings', id))
        toast.success("Listing deleted successfully")
        setListings((prevState) => prevState.filter((listing) => listing.id !== id))
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while deleting the listing")
      }
    }
  }
  function onEdit(id) {
    navigate(`/edit-listing/${id}`)
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
          <button onClick={handleSignOut} className='mb-6 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline uppercase transition duration-150 ease-out' type='button'>Sign Out</button>

        </form>
        <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-out hover:shadow-lg'>
          <Link to="/create-listing" className='flex justify-center items-center'>
            <FaHome className='mr-2 text-3xl' />
            sell or rent your property
          </Link>
        </button>
      </div>
    </section>
    <div className='max-w-6xl px-3 m-6 mx-auto'>
      <h1 className='mb-6 text-3xl text-center mt-6 font-bold'>Your Listings</h1>
      {loading && (<Skeleton />)}
      {listings && listings.length === 0 && (
        <div className='text-center text-gray-600 font-semibold text-xl mt-6'>You have not listed any property yet</div>
      )}
      {!loading && listings.length > 0 && (
        <>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
            {listings.map((listing) => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
                onDelete={() => onDelete(listing.id)}
                onEdit={() => onEdit(listing.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
    </>
  )
}

export default Profile