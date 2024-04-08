import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { FaArrowRight } from "react-icons/fa";


function Home() {
  //Offer listing
  const [offerListing, setofferListing] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchOfferListing() {
      const listRef = collection(db, 'listings')
      const q = query(listRef, where('offer', '==', true), orderBy('timeStamp', 'desc'), limit(4))
      const querySnap = await getDocs(q)
      const offerListings = []
      querySnap.forEach(doc => {
        offerListings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setofferListing(offerListings)
      setLoading(false)
    }
    fetchOfferListing()
  }, [])

// Rent listing
  const [rentListing, setRentListing] = useState(null)
  const [loadingRent, setLoadingRent] = useState(true)
  useEffect(() => {
    async function fetchRentListing() {
      const listRef = collection(db, 'listings')
      const q = query(listRef, where('type', '==', 'rent'), orderBy('timeStamp', 'desc'), limit(4))
      const querySnap = await getDocs(q)
      const rentListings = []
      querySnap.forEach(doc => {
        rentListings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setRentListing(rentListings)
      setLoadingRent(false)
    }
    fetchRentListing()
  }, [])

// Sale listing
  const [saleListing, setSaleListing] = useState(null)
  const [loadingSale, setLoadingSale] = useState(true)
  useEffect(() => {
    async function fetchSaleListing() {
      const listRef = collection(db, 'listings')
      const q = query(listRef, where('type', '==', 'sale'), orderBy('timeStamp', 'desc'), limit(4))
      const querySnap = await getDocs(q)
      const saleListings = []
      querySnap.forEach(doc => {
        saleListings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setSaleListing(saleListings)
      setLoadingSale(false)
    }
    fetchSaleListing()
  }, [])

  return (
    <>
      <Slider />
      <div className='container mx-auto space-y-6'>
        <h1 className='text-4xl font-semibold mt-10 mb-5'>Offer Listings</h1>
        {loading && <p>Loading...</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {offerListing && offerListing.map(({ id, data }) => (
            <ListingItem key={id} listing={data} id={id} />
          ))}
        </div>
        <div className='text-center flex flex-row'>
          <Link to='/offers' className='text-sm text-blue-700 font-semibold'>View All Listings <FaArrowRight/></Link>
        </div>
        <h1 className='text-4xl font-semibold mt-10 mb-5'>Rent Listings</h1>
        {loadingRent && <p>Loading...</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {rentListing && rentListing.map(({ id, data }) => (
            <ListingItem key={id} listing={data} id={id} />
          ))}
          </div>
        <div className='text-center'>
          <Link to='/category/rent' className='text-2xl text-blue-700 font-semibold'>View All Listings</Link>
          </div>
        <h1 className='text-4xl font-semibold mt-10 mb-5'>Sale Listings</h1>
        {loadingSale && <p>Loading...</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {saleListing && saleListing.map(({ id, data }) => (
            <ListingItem key={id} listing={data} id={id} />
          ))}
          </div>
        <div className='text-center'>
          <Link to='/category/sale' className='text-2xl text-blue-700 font-semibold'>View All Listings</Link>
          </div>
      </div>
    </>
  )
}

export default Home