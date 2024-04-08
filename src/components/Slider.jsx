import { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase.config'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

export default function Slider() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      async function fetchListings() {
        const listRef = collection(db, 'listings')
        const q = query(listRef, orderBy('timeStamp', 'desc'), limit(5))
        const querySnap = await getDocs(q)
        const listings = []
        querySnap.forEach(doc => {
          listings.push(doc.data())
        })
        setListings(listings)
        setLoading(false)
      }
      fetchListings()
    }, [])
    
    if (loading) {
      return <Spinner />
    }
  
    if (listings.lenght === 0) {
      return <></>
    }
  return (
    listings && (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, EffectFade, Autoplay]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                effect="fade"
                autoplay={{ delay: 3000 }}
            >
                {listings.map((listing, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full overflow-hidden h-lvh object-cover" style={{background: `url(${listing.imgUrls[0]}) center no-repeat` }}></div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
        </>
    )
  )
}
