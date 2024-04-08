import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase.config'
import ListingItem from '../components/ListingItem'
import Skeleton from '../components/Skeleton'

function Offers() {
  const [offerListing, setofferListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastElement, setLastElement] = useState(null)
  useEffect(() => {
    async function fetchOfferListing() {
      const listRef = collection(db, 'listings')
      const q = query(listRef, where('offer', '==', true), orderBy('timeStamp', 'desc'), limit(4))
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastElement(lastVisible)
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

async function fetchMore() {
  const listRef = collection(db, 'listings')
  const q = query(listRef, where('offer', '==', true), orderBy('timeStamp', 'desc'), startAfter(lastElement), limit(4))
  const querySnap = await getDocs(q)
  const lastVisible = querySnap.docs[querySnap.docs.length - 1]
  setLastElement(lastVisible)
  const offerListings = []
  querySnap.forEach(doc => {
    offerListings.push({
      id: doc.id,
      data: doc.data()
    })
  })
  setofferListing([...offerListing, ...offerListings])
}
  return (
    <>
      <div className='container mx-auto space-y-6'>
        <h1 className='text-4xl font-semibold mt-10 mb-5'>Offers Listings</h1>
        {loading ? (<Skeleton />)
          : offerListing.length === 0 ? <p>No offers available</p>
            : null}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
          {offerListing && offerListing.map(({ id, data }) => (
            <ListingItem key={id} listing={data} id={id} />
          ))}
        </div>
      </div>
      {lastElement && (
        <div className='flex justify-center items-center'>
          <button onClick={fetchMore} className='border-gray-700 text-blue-700 py-2 px-4 rounded-full'>Load More</button>
        </div>
        
      )}
  </>
  )
}

export default Offers