import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

export default function Listing() {
    const [listing, setListing] = useState([])
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

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
  </main>
}
