import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Scrollbar,
  EffectFade,
  Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import { data } from 'autoprefixer';

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listRef = collection(db, 'listings');
      const q = query(listRef, orderBy('timeStamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push(doc.data());
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.lenght === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, EffectFade, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          effect="fade"
          autoplay={{ delay: 4000 }}
        >
          {listings.map((list, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${list.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="relative w-full h-[600px] bg-cover bg-center bg-no-repeat"
              ></div>
              <p className="absolute text-4xl font-bold top-0 text-center text-white bg-black bg-opacity-60 p-5 shadow-md">
                {list.name}
              </p>
              <p className="absolute w-full text-xl font-bold bottom-7 text-center text-white bg-black bg-opacity-40 p-5">
                {list.description.length > 100
                  ? list.description.substring(0, 100) + '...'
                  : list.description}
              </p>
              <p>
                {list.type === 'rent' ? (
                  <p className="absolute text-2xl font-bold top-0 right-0 text-center text-white bg-red-800 bg-opacity-70 shadow-md p-6">
                    {list.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    AED/month
                  </p>
                ) : (
                  <p className="absolute text-2xl font-bold top-0 right-0 text-center text-white bg-green-800 bg-opacity-70 shadow-md p-6">
                    {list.price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    AED
                  </p>
                )}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
