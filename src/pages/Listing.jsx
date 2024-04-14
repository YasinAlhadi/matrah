import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Pagination,
  Scrollbar,
  EffectFade,
  Autoplay,
} from 'swiper/modules';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

export default function Listing() {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactOwner, setContactOwner] = useState(false);
  const { id } = useParams();
  const auth = getAuth();

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        console.log(listing);
        setLoading(false);
      } else {
        console.log('No such document!');
      }
    }
    fetchListing();
  }, [id]);
  const offerPrice = listing.offer ? listing.price - listing.Dprice : null;
  if (loading) {
    return <div>Loading...</div>;
  }
  const position = [listing.lat, listing.long];
  return (
    <main>
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
            <div
              className="w-full overflow-hidden h-[400px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat `,
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-col md:flex-row max-w-6xl lg:mx-auto lg:space-x-5 rounded-lg bg-white p-4 m-4">
        <div className="w-full">
          <p className="text-2xl font-bold m-4 rounded text-yellow-950">
            {listing.name} - AED{' '}
            {listing.offer
              ? listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <div className="flex items-center space-x-1 m-4">
            <MdLocationOn className="h-6 w-6 text-green-800" />
            <p className="font-semibold text-lg mb-[2px] text-gray-600">
              {listing.address}
            </p>
          </div>
          <div className="d">
            {listing.type == 'rent' && (
              <span className="text-white px-4 py-2 font-semibold bg-slate-700 rounded">
                Rent / Annual{' '}
              </span>
            )}{' '}
            {listing.type == 'sale' && (
              <span className="text-white px-2 py-1 font-semibold bg-red-700 rounded m-4">
                Sale
              </span>
            )}{' '}
            {listing.offer && (
              <span className="text-white px-2 py-1 font-semibold rounded bg-red-950">
                Offer Price AED{' '}
                {offerPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>
            )}
          </div>
          <p className="m-4">
            <span className="font-semibold"> Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-5 ml-4 lg:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-2" />{' '}
              {listing.beds > 1 ? `${listing.beds} Beds` : '1 Bed'}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-2" />
              {listing.baths > 1 ? `${listing.baths} Baths` : '1 Bath'}
            </li>
            {listing.parking && (
              <li className="flex items-center whitespace-nowrap">
                <FaParking className="text-lg mr-2" />
                Parking
              </li>
            )}
            {listing.furnished && (
              <li className="flex items-center whitespace-nowrap">
                <FaChair className="text-lg mr-2" />
                Furnished
              </li>
            )}
          </ul>
          {/* <div className="flex items-center space-x-5 ml-4 lg:space-x-10 text-sm font-semibold">
                <p>Posted on {listing.timeStamp}</p>
            </div> */}
          {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
            <div>
              <button
                onClick={() => setContactOwner(true)}
                className="px-7 py-3 bg-blue-700 text-white text-sm shadow-md uppercase font-medium hover:bg-blue-900 w-full mt-4 mb-2"
              >
                Contact Owner
              </button>
            </div>
          )}
          {contactOwner && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className=" bg-red-300 w-full h-[200px] lg:h-[400px] overflow-x-hidden m-6 z-10">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
