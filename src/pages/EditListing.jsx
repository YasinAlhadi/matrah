import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { v4 as uuidv4 } from 'uuid'
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { useNavigate, useParams } from 'react-router'

export default function EditListing() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [geolocation, setGeolocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(null)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    beds: 1,
    baths: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: true,
    price: 0,
    Dprice: 0,
    images: [],
    long: 0,
    lat: 0
  })
  const { type, name, beds, baths, parking, furnished, address, description, offer, price, Dprice, images, long, lat } = formData
  function onChange(e) {
    let bool = null;
    if (e.target.value === 'true') {
      bool = true;
    }
    if (e.target.value === 'false') {
      bool = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }))
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value
      }))
    }
  }
  const param = useParams()

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      navigate('/')
      toast.error('You are not authorized to edit this listing')
    }
  }, [auth.currentUser.uid, listing, navigate])


  useEffect(() => {
    async function fetchListing() {
        const docRef = doc(db, 'listings', param.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setListing(docSnap.data())
          setFormData({...docSnap.data()})
        } else {
          navigate('/')
          toast.error('Listing not found')
        }
    }
    fetchListing()
  }, [navigate, param.id])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    if (+Dprice >= +price) {
      setLoading(false)
      toast.error('Discounted price must be less than the original price')
      return
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images allowed')
      return
    }
    let geo = {}
    let location
    if (geolocation){
      const reponse = await fetch(`https://googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
      const data = await reponse.json()
      geo.lat = data.results[0]?.geometry.location.lat ?? 0
      geo.long = data.results[0]?.geometry.location.lng ?? 0
      location = data.status === 'ZERO_RESULTS' && "Invalid address"
      if (location === "Invalid address") {
        setLoading(false)
        toast.error('Invalid address, please enter a valid address')
        return
      }
    } else {
      geo.lat = lat
      geo.long = long
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const storageRef = ref(storage, `listings/${uuidv4()}`)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        }, (error) => {
          reject(error)
        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        })
      })
    }
    const imgUrls = await Promise.all(
      [...images].map(async (image) => {
        return await storeImage(image)
      })
    ).catch((error) => {
      setLoading(false)
      toast.error('Failed to upload images')
    })
    const formDataCopy = {
      ...formData,
      imgUrls,
      long: geo.long,
      lat: geo.lat,
      timeStamp: serverTimestamp(),
      userRef: auth.currentUser.uid
    }
    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.Dprice
    const docRef = doc(db, 'listings', param.id)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('Listing updated successfully')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  if (loading) {
    return <Spinner />
  }
  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold'>Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className='text-lg mt-6 font-semibold'>Sell or rent </p>
        <div className='flex'>
          <button type="button" id='type' value="sale" onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Sell
          </button>
          <button type="button" id='type' value="rent" onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${type === 'sale' ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            rent
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength="32" minLength="10" required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <div className='flex space-x-6 mb-6'>
          <div>
            <p className='text-lg font-semibold'>Beds</p>
            <input type="number" id='beds' value={beds} onChange={onChange} minLength='1' maxLength='100' required className='w-full px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
          <div>
            <p className='w-full text-lg font-semibold'>Baths</p>
            <input type="number" id='baths' value={baths} onChange={onChange} minLength='1' maxLength='100' required className='px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
        </div>
        <p className='text-lg mt-6 font-semibold'>Parking spot? </p>
        <div className='flex'>
          <button type="button" id='parking' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='parking' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Furnished? </p>
        <div className='flex'>
          <button type="button" id='furnished' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='furnished' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <p className='text-lg mt-6 font-semibold'>Address</p>
        <textarea type="text" id='address' value={address} onChange={onChange} placeholder='Address' required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <div className='flex space-x-6 mb-6'>
          <div>
            <p className='text-lg font-semibold'>latitude</p>
            <input type="number" id='lat' value={lat} onChange={onChange} min='-90' max='90' required className='w-full px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
          <div>
            <p className='w-full text-lg font-semibold'>longitude</p>
            <input type="number" id='long' value={long} onChange={onChange} min='-180' max='180' required className='px-4 py-2 text-lg text-center text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
            </div>
        </div>
        <p className='text-lg font-semibold'>Description</p>
        <textarea type="text" id='description' value={description} onChange={onChange} placeholder='Description' required className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
        <p className='text-lg font-semibold'>Offer? </p>
        <div className='flex mb-6'>
          <button type="button" id='offer' value={true} onClick={onChange} className={`mr-6 bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            Yes
          </button>
          <button type="button" id='offer' value={false} onClick={onChange} className={`bg-white px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out w-full ${offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}`}>
            No
          </button>
        </div>
        <div className="flex space-x-3 items-center">
          <div>
            <p className='text-lg font-semibold'>Price</p>
            <input type="number" id='price' value={price} onChange={onChange} placeholder='Price' required nim="1" max="1000000000" className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
          {type === 'rent' && (
            <div>
            <p className='text-md w-full whitespace-nowrap'>$ / month</p>
          </div>
          )}
        </div>
        {offer && (
          <div>
            <p className='text-lg font-semibold'>Discounted Price</p>
            <input type="number" id='Dprice' value={Dprice} onChange={onChange} placeholder='Discounted Price' required={offer} min="1" max="1000000000" className='w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out mb-6'/>
          </div>
        )}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>The first image will be the cover (max 6)</p>
          <input type="file" id="images" onChange={onChange} accept='.jpg,.png,.jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out' />
        </div>
        <button type='submit' className='mb-6 w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-out hover:shadow-lg'>
          Edit Listing
        </button>
      </form>
    </main>
  )
}
