import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, EffectFade, Autoplay } from 'swiper/modules';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';



export default function Listing() {
    const [listing, setListing] = useState([])
    const [loading, setLoading] = useState(true)
    const [contactOwner, setContactOwner] = useState(false)
    const { id } = useParams()
    const auth = getAuth()

    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, 'listings', id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setListing(docSnap.data())
                console.log(listing)
                setLoading(false)
            } else {
                console.log('No such document!');
            }
        }
        fetchListing()
    }, [id])
    if (loading) {
        return <div>Loading...</div>
    }
  return <main>
    <Swiper
        modules={[Navigation, Pagination, Scrollbar, EffectFade, Autoplay]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      effect="fade"
      autoplay={{ delay: 3000 }}
    >
            {listing.imgUrls.map((image, index) => (
        <SwiperSlide key={index}>
                <div className="w-full overflow-hidden h-[400px]" style={{background: `url(${listing.imgUrls[index]}) center no-repeat`}}></div>
        </SwiperSlide>
            ))}
    </Swiper>
    <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto lg:space-x-5 rounded-lg bg-white p-4 m-4">
        <div className="w-full h-[200px] lg:h-[400px]">
            <p className='text-2xl font-bold m-4 rounded text-yellow-950'>
                {listing.name} - ${" "} {listing.offer ? listing.Dprice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                {listing.type == "rent" && <span className="text-green-500 ml-2">Rent / Month </span>} {listing.type == "sale" && <span className="text-blue-500 ml-2">Sale</span>}{" "}
            </p>
            <div className="flex items-center space-x-1 m-4">
                <MdLocationOn className='h-6 w-6 text-green-800' />
                    <p className='font-semibold text-lg mb-[2px] text-gray-600'>{listing.address}</p>
                {listing.offer && (
                <p> ${+listing.price - +listing.Dprice} Discount</p>
                )} 
            </div>
            <p className='m-4'>
            <span className='font-semibold'> Description - </span>
                {listing.description}
            </p>
            <ul className='flex items-center space-x-5 ml-4 lg:space-x-10 text-sm font-semibold'>
                <li className='flex items-center whitespace-nowrap'><FaBed className='text-lg mr-2'/> {listing.beds > 1 ? `${listing.beds} Beds` : "1 Bed"}</li>
                <li className='flex items-center whitespace-nowrap'><FaBath className='text-lg mr-2'/>{listing.baths > 1 ? `${listing.baths} Baths` : "1 Bath"}</li>
                {listing.parking && <li className='flex items-center whitespace-nowrap'><FaParking className='text-lg mr-2'/>Parking</li>}
                {listing.furnished && <li className='flex items-center whitespace-nowrap'><FaChair className='text-lg mr-2'/>Furnished</li>}
            </ul>
            {/* <div className="flex items-center space-x-5 ml-4 lg:space-x-10 text-sm font-semibold">
                <p>Posted on {listing.timeStamp}</p>
            </div> */}
            {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
                <div>
                    <button onClick={() => setContactOwner(true)} className='px-7 py-3 bg-blue-700 text-white text-sm shadow-md uppercase font-medium hover:bg-blue-900 w-full mt-4 mb-2'>Contact Owner</button>
                </div>
            )}
            {contactOwner && (<Contact userRef={listing.userRef} listing={listing}/>)}
    </div>
        <div className=" bg-blue-100 w-full h-[200px] lg:h-[400px] overflow-x-hidden"></div>
    </div>
  </main>
}
